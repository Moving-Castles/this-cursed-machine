// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, Energy, CarriedBy, EntityType, MachinesInPod } from "../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibNetwork } from "../libraries/Libraries.sol";

contract DestroySystem is System {
  /**
   * @notice Destroys the specified machine entity.
   * @param _machineEntity The identifier for the machine entity to be destroyed.
   */
  function destroy(bytes32 _machineEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(EntityType.get(_machineEntity) == ENTITY_TYPE.MACHINE, "not machine");

    LibNetwork.resolve(coreEntity);

    // Destroy machine entity
    LibEntity.destroy(_machineEntity);

    bytes32 podEntity = CarriedBy.get(coreEntity);

    // Remove it from the list of machines
    MachinesInPod.set(podEntity, LibUtils.removeFromArray(MachinesInPod.get(podEntity), _machineEntity));

    // @todo remove enity from incomingconnections on other machines
  }
}
