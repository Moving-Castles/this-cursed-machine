// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, GameConfig, GameConfigData, IncomingConnections, OutgoingConnections, CarriedBy } from "../../codegen/index.sol";
import { ENTITY_TYPE, PORT_INDEX } from "../../codegen/common.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract ConnectSystem is System {
  /**
   * @notice Establishes a connection from the source machine to the target machine on a specified port if not occupied.
   * @param _sourceMachine The identifier for the source machine.
   * @param _targetMachine The identifier for the target machine.
   * @param _portIndex The port index on the source machine which determines the position (FIRST or SECOND) to write in the outgoing connections array.
   */
  function connect(bytes32 _sourceMachine, bytes32 _targetMachine, PORT_INDEX _portIndex) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_sourceMachine) == podEntity && CarriedBy.get(_targetMachine) == podEntity, "not in pod");

    require(EntityType.get(_sourceMachine) == ENTITY_TYPE.MACHINE, "source not machine");
    require(EntityType.get(_targetMachine) == ENTITY_TYPE.MACHINE, "target not machine");
    require(_sourceMachine != _targetMachine, "source and target are same");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Determine the index for the outgoing connection based on the _portIndex
    uint indexToWrite = _portIndex == PORT_INDEX.FIRST ? 0 : 1;

    // Check if the index is within bounds and not occupied
    require(indexToWrite < OutgoingConnections.length(_sourceMachine), "outgoing index out of bounds");
    require(OutgoingConnections.getItem(_sourceMachine, indexToWrite) == bytes32(0), "outgoing port already occupied");

    // Insert _targetMachine at the specified index for outgoing connections
    OutgoingConnections.update(_sourceMachine, indexToWrite, _targetMachine);

    // Get the total number of incoming connections for the target machine
    uint256 incomingConnectionsLength = IncomingConnections.length(_targetMachine);
    bool slotFound = false;
    // Fill the first available slot in incoming connections
    for (uint i = 0; i < incomingConnectionsLength; i++) {
      if (IncomingConnections.getItem(_targetMachine, i) == bytes32(0)) {
        IncomingConnections.update(_targetMachine, i, _sourceMachine);
        slotFound = true;
        break;
      }
    }
    // Revert if no available slot is found
    require(slotFound, "no available incoming ports");
  }
}
