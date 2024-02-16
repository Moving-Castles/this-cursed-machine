// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";
import { FLOW_RATE } from "../constants.sol";

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
    uint32[2] memory inletAmounts = [Amount.get(_inletDepotEntities[0]), Amount.get(_inletDepotEntities[1])];

    // DEBUG
    for (uint i; i < 2; i++) {
      console.log("inletAmounts");
      console.log(inletAmounts[i]);
    }

    // !!! If one of the inputs is 0, it will be the lowests even if it does not contribute to the output
    uint32 lowestInput = inletAmounts[0] > inletAmounts[1] ? inletAmounts[1] : inletAmounts[0];

    /*
     * With a flow rate of FLOW_RATE per block,
     * how long does it take for the lowest input to be exhausted?
     */
    uint32 exhaustionBlock = lowestInput / FLOW_RATE;

    /*
     * if lowestInput > _blocksSinceLastResolution => capped output amount is blocks since last resolution
     * if lowestInput < _blocksSinceLastResolution => capped output amount is equal to exhaustionBlock
     */
    uint32 cappedBlocks = exhaustionBlock > uint32(_blocksSinceLastResolution)
      ? uint32(_blocksSinceLastResolution)
      : exhaustionBlock;

    uint32 cumulativeOutputAmount = _output.amount * cappedBlocks;

    // DEBUG
    console.log("lowestInput");
    console.log(lowestInput);
    console.log("exhaustionBlock");
    console.log(exhaustionBlock);
    console.log("cappedBlocks");
    console.log(cappedBlocks);
    console.log("cumulativeOutputAmount");
    console.log(cumulativeOutputAmount);

    /*
     * Write to outlet depot
     * Add if material is same, oterwise replace
     */
    if (MaterialType.get(_outletDepotEntity) == _output.materialType) {
      Amount.set(_outletDepotEntity, Amount.get(_outletDepotEntity) + cumulativeOutputAmount);
    } else {
      MaterialType.set(_outletDepotEntity, _output.materialType);
      Amount.set(_outletDepotEntity, cumulativeOutputAmount);
    }

    // DEBUG
    uint32 consumedInletAmount = cappedBlocks * FLOW_RATE;
    console.log("consumedInletAmount");
    console.log(consumedInletAmount);

    /*
     * Write to inlet depots
     * Skip if inlet did not contribute to the output
     * Empty depot if we exhausted it
     */
    for (uint i; i < 2; i++) {
      if (_output.divisors[i] == 0) continue;
      if (consumedInletAmount > inletAmounts[i]) {
        MaterialType.set(_inletDepotEntities[i], MATERIAL_TYPE.NONE);
        Amount.set(_inletDepotEntities[i], 0);
      } else {
        Amount.set(_inletDepotEntities[i], inletAmounts[i] - consumedInletAmount);
      }
    }
  }
}
