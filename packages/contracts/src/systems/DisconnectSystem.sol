// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Energy, EntityType, GameConfig, GameConfigData, IncomingConnections, OutgoingConnections } from "../codegen/index.sol";
import { ENTITY_TYPE, PORT_INDEX } from "../codegen/common.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract DisconnectSystem is System {
  /**
   * @notice Disconnects a connection from the source machine on a specified port.
   * @param _sourceMachine The identifier for the source machine.
   * @param _portIndex The port index on the source machine which determines which connection to disconnect.
   */
  function disconnect(bytes32 _sourceMachine, PORT_INDEX _portIndex) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Resolve network
    LibNetwork.resolve(playerEntity);

    // Determine the index for the outgoing connection based on the _portIndex
    uint indexToDisconnect = _portIndex == PORT_INDEX.FIRST ? 0 : 1;

    // Retrieve the existing outgoing connections for the source machine
    bytes32[] memory outgoingConnections = OutgoingConnections.get(_sourceMachine);
    // Check if the index is within bounds
    require(indexToDisconnect < outgoingConnections.length, "outgoing index out of bounds");

    // Get the target machine from the outgoing connections
    bytes32 targetMachine = outgoingConnections[indexToDisconnect];
    require(targetMachine != bytes32(0), "no connection to disconnect");

    // Clear the connection entry in the source machine's outgoing connections
    outgoingConnections[indexToDisconnect] = bytes32(0);

    // Retrieve the existing incoming connections for the target machine
    bytes32[] memory incomingConnections = IncomingConnections.get(targetMachine);

    // Find and clear the corresponding entry in the target machine's incoming connections
    bool disconnected = false;
    for (uint i = 0; i < incomingConnections.length; i++) {
      if (incomingConnections[i] == _sourceMachine) {
        incomingConnections[i] = bytes32(0);
        disconnected = true;
        break;
      }
    }
    require(disconnected, "failed to disconnect");

    // Update OutgoingConnections and IncomingConnections for both machines
    OutgoingConnections.set(_sourceMachine, outgoingConnections);
    IncomingConnections.set(targetMachine, incomingConnections);
  }
}
