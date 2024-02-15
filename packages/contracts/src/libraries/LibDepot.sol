// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";

library LibDepot {
  function create(bytes32 _podEntity, uint32 _index) internal returns (bytes32) {
    bytes32 depotEntity = getUniqueEntity();
    EntityType.set(depotEntity, ENTITY_TYPE.DEPOT);
    CarriedBy.set(depotEntity, _podEntity);
    MaterialType.set(depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(depotEntity, 0);
    BuildIndex.set(depotEntity, _index + 1);
    DepotConnection.set(depotEntity, bytes32(0));
    return depotEntity;
  }

  function write(
    bytes32[2] memory _inletDepotEntities,
    bytes32 _outletDepotEntity,
    uint256 _blocksSinceLastResolution,
    Product memory _output
  ) internal {
    uint32 cumulativeOutputAmount = _output.amount * uint32(_blocksSinceLastResolution);

    uint32[2] memory inletAmounts = [Amount.get(_inletDepotEntities[0]), Amount.get(_inletDepotEntities[1])];

    // The divisor keeps track of how much the inlet materials has been diluted by the machines
    uint32[2] memory consumedInletAmounts = [
      _output.divisors[0] * cumulativeOutputAmount,
      _output.divisors[1] * cumulativeOutputAmount
    ];

    // Did we exhaust the amount of material the inlets allows us to produce?
    bool[2] memory exhaustedInletDepots = [
      consumedInletAmounts[0] >= inletAmounts[0],
      consumedInletAmounts[0] >= inletAmounts[1]
    ];

    // DEBUG
    // for (uint i; i < 2; i++) {
    //   console.log("inlet depot");
    //   console.log(i);
    //   console.logBytes32(_inletDepotEntities[i]);
    //   console.log("divisor");
    //   console.log(_output.divisors[i]);
    //   console.log("inlet amount");
    //   console.log(inletAmounts[i]);
    //   console.log("consumed inlet amount");
    //   console.log(consumedInletAmounts[i]);
    //   console.log("exhausted inlet depot");
    //   console.log(exhaustedInletDepots[i]);
    //   console.log("************");
    // }

    // Cap output by the amount in inlet depots
    cumulativeOutputAmount = capOutput(cumulativeOutputAmount, inletAmounts, _output.divisors);

    // Write to outlet depot
    if (MaterialType.get(_outletDepotEntity) == _output.materialType) {
      // Add if material is same
      Amount.set(_outletDepotEntity, Amount.get(_outletDepotEntity) + cumulativeOutputAmount);
    } else {
      // Otherwise, replace
      MaterialType.set(_outletDepotEntity, _output.materialType);
      Amount.set(_outletDepotEntity, cumulativeOutputAmount);
    }

    // Subtract from inlet depots
    for (uint i; i < 2; i++) {
      if (exhaustedInletDepots[i]) {
        MaterialType.set(_inletDepotEntities[i], MATERIAL_TYPE.NONE);
        Amount.set(_inletDepotEntities[i], 0);
      } else {
        Amount.set(_inletDepotEntities[i], inletAmounts[i] - consumedInletAmounts[i]);
      }
    }
  }

  function capOutput(
    uint32 _cumulativeAmount,
    uint32[2] memory _inletAmounts,
    uint32[2] memory _divisors
  ) internal pure returns (uint32) {
    // OLD calc: cumulativeAmount = exhaustedInletDepot ? inletAmount / divisor : cumulativeAmount;
    // Find which inlet is the limiting factor
    // !!! does not seem right as if both are limiting we should cap by the lowest?
    for (uint i; i < 2; i++) {
      if (_divisors[i] == 0) continue;
      if (_cumulativeAmount >= _inletAmounts[i]) {
        return _inletAmounts[i] / _divisors[i];
      }
    }

    return _cumulativeAmount;
  }
}
