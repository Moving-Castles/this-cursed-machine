// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy, EntityType, CreationBlock, MachinesInPod, LevelStartBlock, OutletEntity, InletEntity, StorageInPod } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibEntity, LibStorage } from "../libraries/Libraries.sol";

contract RestartSystem is System {
  /**
   * @notice Restarts and reconfigures the player entity, setting it back to level 1 and rearranging associated entities within a new pod.
   * @return podEntity The identifier of the newly created pod entity.
   * @dev Ensure dynamic energy setting based on level and implement the deletion of the old pod in future versions.
   */
  function restart() public returns (bytes32) {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Go to level 1
    Level.set(playerEntity, 1);

    // Set initial energy
    Energy.set(playerEntity, 100);

    // Create pod
    bytes32 podEntity = LibPod.create();

    // Create storage
    bytes32[] memory storageInPod = new bytes32[](2);
    storageInPod[0] = LibStorage.create(podEntity);
    storageInPod[1] = LibStorage.create(podEntity);
    StorageInPod.set(podEntity, storageInPod);

    // Create Inlet
    bytes32 inletEntity = LibEntity.create(MACHINE_TYPE.INLET);
    CarriedBy.set(inletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), inletEntity));
    // Save inlet entity
    InletEntity.set(podEntity, inletEntity);

    // Place player in pod
    CarriedBy.set(playerEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), playerEntity));

    // Create Outlet
    bytes32 outletEntity = LibEntity.create(MACHINE_TYPE.OUTLET);
    CarriedBy.set(outletEntity, podEntity);
    MachinesInPod.set(podEntity, LibUtils.addToArray(MachinesInPod.get(podEntity), outletEntity));
    // Save outlet entity
    OutletEntity.set(podEntity, outletEntity);

    // Set level start block
    LevelStartBlock.set(playerEntity, block.number);

    return podEntity;
  }
}
