// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, GameConfig, GameConfigData, IncomingConnections, OutgoingConnections } from "../codegen/index.sol";
import { ENTITY_TYPE, PORT_INDEX } from "../codegen/common.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract ConnectSystem is System {
  /**
   * @notice Establishes a connection from the source machine to the target machine on a specified port if not occupied.
   * @param _sourceMachine The identifier for the source machine.
   * @param _targetMachine The identifier for the target machine.
   * @param _portIndex The port index on the source machine which determines the position (FIRST or SECOND) to write in the outgoing connections array.
   */
  function connect(bytes32 _sourceMachine, bytes32 _targetMachine, PORT_INDEX _portIndex) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    require(EntityType.get(_sourceMachine) == ENTITY_TYPE.MACHINE, "source not machine");
    require(EntityType.get(_targetMachine) == ENTITY_TYPE.MACHINE, "target not machine");
    require(_sourceMachine != _targetMachine, "source and target are same");

    // Resolve network
    LibNetwork.resolve(playerEntity);

    // Determine the index for the outgoing connection based on the _portIndex
    uint indexToWrite = _portIndex == PORT_INDEX.FIRST ? 0 : 1;

    // Retrieve the existing outgoing connections for the source machine
    bytes32[] memory outgoingConnections = OutgoingConnections.get(_sourceMachine);
    // Check if the index is within bounds and not occupied
    require(indexToWrite < outgoingConnections.length, "outgoing index out of bounds");
    require(outgoingConnections[indexToWrite] == bytes32(0), "outgoing port already occupied");

    // Insert _targetMachine at the specified index for outgoing connections
    outgoingConnections[indexToWrite] = _targetMachine;
    OutgoingConnections.set(_sourceMachine, outgoingConnections);

    // Retrieve the existing incoming connections for the target machine
    bytes32[] memory incomingConnections = IncomingConnections.get(_targetMachine);
    bool slotFound = false;
    // Find the first available slot in incoming connections
    for (uint i = 0; i < incomingConnections.length; i++) {
      if (incomingConnections[i] == bytes32(0)) {
        incomingConnections[i] = _sourceMachine;
        slotFound = true;
        break;
      }
    }
    // Revert if no available slot is found
    require(slotFound, "no available incoming ports");

    // Set the updated array for incoming connections
    IncomingConnections.set(_targetMachine, incomingConnections);
  }
}
