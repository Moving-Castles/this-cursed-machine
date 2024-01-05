// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, Energy, CarriedBy, EntityType, MachinesInPod, IncomingConnections, OutgoingConnections } from "../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibNetwork } from "../libraries/Libraries.sol";

contract DestroySystem is System {
  /**
   * @notice Destroys the specified machine entity and cleans up all its network connections.
   * @param _machineEntity The identifier for the machine entity to be destroyed.
   */
  function destroy(bytes32 _machineEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    require(EntityType.get(_machineEntity) == ENTITY_TYPE.MACHINE, "not machine");

    // Get outgoing connections
    bytes32[] memory outgoingConnections = OutgoingConnections.get(_machineEntity);
    // Get incoming connections
    bytes32[] memory incomingConnections = IncomingConnections.get(_machineEntity);

    if (outgoingConnections.length > 0 || incomingConnections.length > 0) {
      // Only resolve if the machine is connected
      LibNetwork.resolve(playerEntity);

      // Iterate through each incoming connection
      for (uint256 i = 0; i < incomingConnections.length; i++) {
        bytes32 sourceMachine = incomingConnections[i];
        if (sourceMachine != bytes32(0)) {
          // Get outgoing connections of the source machine
          bytes32[] memory sourceOutgoingConnections = OutgoingConnections.get(sourceMachine);

          // Iterate through the target machine's outgoing connections
          for (uint256 j = 0; j < sourceOutgoingConnections.length; j++) {
            if (sourceOutgoingConnections[j] == _machineEntity) {
              // Remove the reference to the destroyed machine
              sourceOutgoingConnections[j] = bytes32(0);
              // Update the source machine's outgoing connections
              OutgoingConnections.set(sourceMachine, sourceOutgoingConnections);
              break;
            }
          }
        }
      }

      // Iterate through each outgoing connection
      for (uint256 i = 0; i < outgoingConnections.length; i++) {
        bytes32 targetMachine = outgoingConnections[i];
        if (targetMachine != bytes32(0)) {
          // Get incoming connections of the target machine
          bytes32[] memory targetIncomingConnections = IncomingConnections.get(targetMachine);

          // Iterate through the target machine's incoming connections
          for (uint256 j = 0; j < targetIncomingConnections.length; j++) {
            if (targetIncomingConnections[j] == _machineEntity) {
              // Remove the reference to the destroyed machine
              targetIncomingConnections[j] = bytes32(0);
              // Update the target machine's incoming connections
              IncomingConnections.set(targetMachine, targetIncomingConnections);
              break;
            }
          }
        }
      }
    }

    // Destroy machine entity
    LibEntity.destroy(_machineEntity);

    bytes32 podEntity = CarriedBy.get(playerEntity);

    // Remove it from the list of machines
    MachinesInPod.set(podEntity, LibUtils.removeFromArray(MachinesInPod.get(podEntity), _machineEntity));
  }
}
