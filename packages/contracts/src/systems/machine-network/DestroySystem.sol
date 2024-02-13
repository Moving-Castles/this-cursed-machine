// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, CarriedBy, EntityType, MachinesInPod, IncomingConnections, OutgoingConnections } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibEntity, LibNetwork } from "../../libraries/Libraries.sol";

contract DestroySystem is System {
  /**
   * @notice Destroys the specified machine entity and cleans up all its network connections.
   * @param _machineEntity The identifier for the machine entity to be destroyed.
   */
  function destroy(bytes32 _machineEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_machineEntity) == podEntity, "not in pod");

    require(EntityType.get(_machineEntity) == ENTITY_TYPE.MACHINE, "not machine");

    // Get outgoing connections
    bytes32[] memory outgoingConnections = OutgoingConnections.get(_machineEntity);
    // Get incoming connections
    bytes32[] memory incomingConnections = IncomingConnections.get(_machineEntity);

    if (outgoingConnections.length > 0 || incomingConnections.length > 0) {
      // Only resolve if the machine is connected
      LibNetwork.resolve(podEntity);

      // Iterate through each incoming connection
      for (uint256 i = 0; i < incomingConnections.length; i++) {
        _removeOutgoingConnection(incomingConnections[i], _machineEntity);
      }

      // Iterate through each outgoing connection
      for (uint256 i = 0; i < outgoingConnections.length; i++) {
        _removeIncomingConnection(outgoingConnections[i], _machineEntity);
      }
    }

    // Destroy machine entity
    LibEntity.destroy(_machineEntity);

    // Remove it from the list of machines
    MachinesInPod.set(podEntity, LibUtils.removeFromArray(MachinesInPod.get(podEntity), _machineEntity));
  }

  function _removeOutgoingConnection(bytes32 _sourceMachine, bytes32 _connectedMachine) internal {
    if (_sourceMachine == bytes32(0)) {
      return;
    }
    // Iterate through the source machine's outgoing connections
    uint256 length = OutgoingConnections.length(_sourceMachine);
    for (uint256 i = 0; i < length; i++) {
      if (OutgoingConnections.getItem(_sourceMachine, i) == _connectedMachine) {
        // Remove the reference to the destroyed machine
        OutgoingConnections.update(_sourceMachine, i, bytes32(0));
        break;
      }
    }
  }

  function _removeIncomingConnection(bytes32 _targetMachine, bytes32 _connectedMachine) internal {
    if (_targetMachine == bytes32(0)) {
      return;
    }
    // Iterate through the source machine's incoming connections
    uint256 length = IncomingConnections.length(_targetMachine);
    for (uint256 i = 0; i < length; i++) {
      if (IncomingConnections.getItem(_targetMachine, i) == _connectedMachine) {
        // Remove the reference to the destroyed machine
        IncomingConnections.update(_targetMachine, i, bytes32(0));
        break;
      }
    }
  }
}
