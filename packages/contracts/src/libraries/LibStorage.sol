// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, StorageConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../constants.sol";

library LibStorage {
  function create(bytes32 podEntity) internal returns (bytes32) {
    bytes32 storageEntity = getUniqueEntity();
    EntityType.set(storageEntity, ENTITY_TYPE.STORAGE);
    CarriedBy.set(storageEntity, podEntity);
    MaterialType.set(storageEntity, MATERIAL_TYPE.NONE);
    Amount.set(storageEntity, 0);
    StorageConnection.set(storageEntity, bytes32(0));
    return storageEntity;
  }

  function writeToStorage(
    bytes32 _inletStorageEntity,
    bytes32 _outletStorageEntity,
    uint256 _blocksSinceLastResolution,
    Product memory _output
  ) internal {
    uint32 cumulativeAmount = _output.amount * uint32(_blocksSinceLastResolution);

    // !!! PROBLEM
    // We now have two inlets and potentially two inlet storages that affect how much we can produce
    uint32 inletAmount = Amount.get(_inletStorageEntity);

    uint32 factor = _output.factor == 0 ? 1 : _output.factor;

    // The factor keeps track of how much the inlet material has been diluted by the machines
    uint32 consumedInletAmount = factor * cumulativeAmount;

    // Did we exhaust the amount of material the inlet material allows us to produce?
    bool exhaustedInletStorage = consumedInletAmount >= inletAmount;

    // Cap output by the amount in inlet storage
    cumulativeAmount = exhaustedInletStorage ? inletAmount / factor : cumulativeAmount;

    // Add if material is same
    if (MaterialType.get(_outletStorageEntity) == _output.materialType) {
      Amount.set(_outletStorageEntity, Amount.get(_outletStorageEntity) + cumulativeAmount);
    } else {
      MaterialType.set(_outletStorageEntity, _output.materialType);
      Amount.set(_outletStorageEntity, cumulativeAmount);
    }

    // Subtract from inlet storage
    if (exhaustedInletStorage) {
      MaterialType.set(_inletStorageEntity, MATERIAL_TYPE.NONE);
      Amount.set(_inletStorageEntity, 0);
    } else {
      Amount.set(_inletStorageEntity, inletAmount - consumedInletAmount);
    }

    // @todo: check if storage is full
  }
}
