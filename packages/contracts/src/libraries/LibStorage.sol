// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, StorageConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { Product } from "../constants.sol";

library LibStorage {
  function create(bytes32 podEntity) internal returns (bytes32) {
    bytes32 storageEntity = LibUtils.getRandomKey();
    EntityType.set(storageEntity, ENTITY_TYPE.STORAGE);
    CarriedBy.set(storageEntity, podEntity);
    MaterialType.set(storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(storageEntity, 0);
    StorageConnection.set(storageEntity, bytes32(0));
    return storageEntity;
  }

  function writeToStorage(bytes32 storageEntity, uint256 _blocksSinceLastResolution, Product memory _output) internal {
    MaterialType.set(storageEntity, _output.materialType);
    uint32 scaledAmount = _output.amount * uint32(_blocksSinceLastResolution);
    Amount.set(storageEntity, scaledAmount);
    // todo: check if storage is full
    // todo: check if if material is same as previous material, in that case add to amount
  }
}
