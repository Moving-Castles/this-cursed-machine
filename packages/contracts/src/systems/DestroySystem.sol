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
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(EntityType.get(_machineEntity) == ENTITY_TYPE.MACHINE, "not machine");

    LibNetwork.resolve(coreEntity);

    // Get outgoing connections
    bytes32[] memory outgoingConnections = OutgoingConnections.get(_machineEntity);

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

    // Destroy machine entity
    LibEntity.destroy(_machineEntity);

    bytes32 podEntity = CarriedBy.get(coreEntity);

    // Remove it from the list of machines
    MachinesInPod.set(podEntity, LibUtils.removeFromArray(MachinesInPod.get(podEntity), _machineEntity));
  }
}
