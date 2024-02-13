// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, GameConfig, GameConfigData, IncomingConnections, OutgoingConnections, CarriedBy } from "../../codegen/index.sol";
import { ENTITY_TYPE, PORT_INDEX } from "../../codegen/common.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract DisconnectSystem is System {
  /**
   * @notice Disconnects a connection from the source machine on a specified port.
   * @param _sourceMachine The identifier for the source machine.
   * @param _portIndex The port index on the source machine which determines which connection to disconnect.
   */
  function disconnect(bytes32 _sourceMachine, PORT_INDEX _portIndex) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_sourceMachine) == podEntity, "not in pod");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Determine the index for the outgoing connection based on the _portIndex
    uint indexToDisconnect = _portIndex == PORT_INDEX.FIRST ? 0 : 1;

    // Check if the index is within bounds
    require(indexToDisconnect < OutgoingConnections.length(_sourceMachine), "outgoing index out of bounds");

    // Get the target machine from the outgoing connections
    bytes32 targetMachine = OutgoingConnections.getItem(_sourceMachine, indexToDisconnect);
    require(targetMachine != bytes32(0), "no connection to disconnect");

    // Clear the connection entry in the source machine's outgoing connections
    OutgoingConnections.update(_sourceMachine, indexToDisconnect, bytes32(0));

    // Find and clear the corresponding entry in the target machine's incoming connections
    bool disconnected = _removeIncomingConnection(targetMachine, _sourceMachine);
    require(disconnected, "failed to disconnect");
  }

  function _removeIncomingConnection(
    bytes32 _targetMachine,
    bytes32 _connectedMachine
  ) internal returns (bool disconnected) {
    // Iterate through the source machine's incoming connections
    uint256 length = IncomingConnections.length(_targetMachine);
    for (uint256 i = 0; i < length; i++) {
      if (IncomingConnections.getItem(_targetMachine, i) == _connectedMachine) {
        // Remove the reference to the destroyed machine
        IncomingConnections.update(_targetMachine, i, bytes32(0));
        return true;
      }
    }
    return false;
  }
}
