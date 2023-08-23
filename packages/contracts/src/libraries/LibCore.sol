// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { GameConfig, GameConfigData, Level, LevelTableId, Name, CreationBlock, ReadyBlock, Energy, EntityType, EntityTypeTableId, Active, ActiveTableId, Rotation, MachineType } from "../codegen/Tables.sol";
import { ENTITY_TYPE, MACHINE_TYPE, ROTATION } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibCore {
  /**
   * @dev Spawns a new core entity with specified attributes.
   *
   * The function sets the entity type as "CORE" and assigns the provided name and level to the core entity.
   * Additionally, the current block number is recorded for both the creation and readiness of the core entity.
   *
   * @param _coreEntity The byte key associated with the core entity to be spawned.
   * @param _level The level to be assigned to the core entity.
   * @param _name The name to be given to the core entity.
   */
  function spawn(bytes32 _coreEntity, uint32 _level, string memory _name) internal {
    EntityType.set(_coreEntity, ENTITY_TYPE.MACHINE);
    MachineType.set(_coreEntity, MACHINE_TYPE.CORE);
    Energy.set(_coreEntity, GameConfig.get().coreInitialEnergy);
    CreationBlock.set(_coreEntity, block.number);
    Name.set(_coreEntity, _name);
    Level.set(_coreEntity, _level);
    Rotation.set(_coreEntity, ROTATION.DEG0);
    ReadyBlock.set(_coreEntity, block.number);
  }
}
