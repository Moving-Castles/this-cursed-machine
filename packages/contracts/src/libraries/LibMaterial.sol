// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { EntityType, CreationBlock, CarriedBy, CreatedBy, MaterialType, Amount } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibPod } from "./LibPod.sol";

library LibMaterial {
  /**
   * @notice Creates a new material entity and associates it with a box and core entity
   * @dev Generates a unique identifier for the material, setting its properties and linking it to box and core entities
   * @param _materialType The type of material to create
   * @param _scaledAmount The scaled amount of the material
   * @param _podEntity The identifier of the box entity that will carry the material
   * @param _coreEntity The identifier of the core entity responsible for creating the material
   * @return materialEntity The unique identifier for the newly created material entity
   */
  function create(
    MATERIAL_TYPE _materialType,
    uint32 _scaledAmount,
    bytes32 _podEntity,
    bytes32 _coreEntity
  ) internal returns (bytes32) {
    bytes32 materialEntity = LibUtils.getRandomKey();
    EntityType.set(materialEntity, ENTITY_TYPE.MATERIAL);
    CreationBlock.set(materialEntity, block.number);
    CarriedBy.set(materialEntity, _podEntity);
    CreatedBy.set(materialEntity, _coreEntity);
    MaterialType.set(materialEntity, _materialType);
    Amount.set(materialEntity, _scaledAmount);
    return materialEntity;
  }

  /**
   * @notice Destroys a material entity, removing all its associated data
   * @dev Deletes the entity's type, creation block, carrier, creator, material type, and amount from their respective storage mappings
   * @param _materialEntity The unique identifier of the material entity to be destroyed
   */
  function destroy(bytes32 _materialEntity) internal {
    EntityType.deleteRecord(_materialEntity);
    CreationBlock.deleteRecord(_materialEntity);
    CarriedBy.deleteRecord(_materialEntity);
    CreatedBy.deleteRecord(_materialEntity);
    MaterialType.deleteRecord(_materialEntity);
    Amount.deleteRecord(_materialEntity);
  }

  /**
   * @dev Removes material from the box without really destroying it
   * @param _materialEntity The unique identifier of the material entity to be destroyed
   */
  function trash(bytes32 _materialEntity) internal {
    CarriedBy.deleteRecord(_materialEntity);
  }
}
