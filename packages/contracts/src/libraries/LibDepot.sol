// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../constants.sol";

library LibDepot {
  function create(bytes32 podEntity) internal returns (bytes32) {
    bytes32 depotEntity = getUniqueEntity();
    EntityType.set(depotEntity, ENTITY_TYPE.DEPOT);
    CarriedBy.set(depotEntity, podEntity);
    MaterialType.set(depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(depotEntity, 0);
    DepotConnection.set(depotEntity, bytes32(0));
    return depotEntity;
  }

  function write(
    bytes32 _inletDepotEntity,
    bytes32 _outletDepotEntity,
    uint256 _blocksSinceLastResolution,
    Product memory _output
  ) internal {
    uint32 cumulativeAmount = _output.amount * uint32(_blocksSinceLastResolution);

    // !!! PROBLEM
    // We now have two inlets and potentially two inlet depots that affect how much we can produce
    uint32 inletAmount = Amount.get(_inletDepotEntity);

    uint32 factor = _output.factor == 0 ? 1 : _output.factor;

    // The factor keeps track of how much the inlet material has been diluted by the machines
    uint32 consumedInletAmount = factor * cumulativeAmount;

    // Did we exhaust the amount of material the inlet material allows us to produce?
    bool exhaustedInletDepot = consumedInletAmount >= inletAmount;

    // Cap output by the amount in inlet depot
    cumulativeAmount = exhaustedInletDepot ? inletAmount / factor : cumulativeAmount;

    // Add if material is same
    if (MaterialType.get(_outletDepotEntity) == _output.materialType) {
      Amount.set(_outletDepotEntity, Amount.get(_outletDepotEntity) + cumulativeAmount);
    } else {
      MaterialType.set(_outletDepotEntity, _output.materialType);
      Amount.set(_outletDepotEntity, cumulativeAmount);
    }

    // Subtract from inlet depot
    if (exhaustedInletDepot) {
      MaterialType.set(_inletDepotEntity, MATERIAL_TYPE.NONE);
      Amount.set(_inletDepotEntity, 0);
    } else {
      Amount.set(_inletDepotEntity, inletAmount - consumedInletAmount);
    }

    // @todo: check if depot is full
  }
}
