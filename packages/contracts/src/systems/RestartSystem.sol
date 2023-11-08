// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy, EntityType, CreationBlock, MachinesInPod } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibEntity } from "../libraries/Libraries.sol";

contract RestartSystem is System {
  /**
   * @notice Restarts and reconfigures the core entity, setting it back to level 1 and rearranging associated entities within a new box.
   * @return podEntity The identifier of the newly created box entity.
   * @dev Ensure dynamic energy setting based on level and implement the deletion of the old box in future versions.
   */
  function restart() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    // Go to level 1
    Level.set(coreEntity, 1);

    // Set initial energy
    Energy.set(coreEntity, 100);

    // Create pod
    bytes32 podEntity = LibPod.create();

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), inletEntity));

    // Place core in pod
    CarriedBy.set(coreEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), coreEntity));

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), outletEntity));

    return podEntity;
  }
}
