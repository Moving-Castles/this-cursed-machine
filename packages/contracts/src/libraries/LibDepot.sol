// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";
import { FLOW_RATE } from "../constants.sol";

library LibDepot {
  struct InletDepotAmount {
    uint32 index;
    uint32 amount;
  }

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
    // DEBUG
    // console.log("_output");
    // console.logBytes32(_output.machineId);
    // console.log(_output.amount);
    // console.log(uint32(_output.materialType));
    // console.log(_output.inletActive[0]);
    // console.log(_output.inletActive[1]);

    InletDepotAmount[] memory usedInletAmounts = getUsedInletAmounts(_output.inletActive, _inletDepotEntities);

    // DEBUG
    // for (uint i; i < usedInletAmounts.length; i++) {
    //   console.log("usedInlet index");
    //   console.log(usedInletAmounts[i].index);
    //   console.log("usedInlet amount");
    //   console.log(usedInletAmounts[i].amount);
    // }

    InletDepotAmount memory lowestInput = findLowestValue(usedInletAmounts);

    /*
     * With a flow rate of FLOW_RATE per block,
     * how long does it take for the lowest input to be exhausted?
     */
    uint32 exhaustionBlock = lowestInput.amount / FLOW_RATE;

    /*
     * if lowestInput > _blocksSinceLastResolution => capped output amount is blocks since last resolution
     * if lowestInput < _blocksSinceLastResolution => capped output amount is equal to exhaustionBlock
     */
    uint32 cappedBlocks = exhaustionBlock > uint32(_blocksSinceLastResolution)
      ? uint32(_blocksSinceLastResolution)
      : exhaustionBlock;

    uint32 cumulativeOutputAmount = _output.amount * cappedBlocks;

    // DEBUG
    // console.log("lowestInput.amount");
    // console.log(lowestInput.amount);
    // console.log("lowestInput.index");
    // console.log(lowestInput.index);
    // console.log("exhaustionBlock");
    // console.log(exhaustionBlock);
    // console.log("cappedBlocks");
    // console.log(cappedBlocks);
    // console.log("cumulativeOutputAmount");
    // console.log(cumulativeOutputAmount);

    /*
     * Write to outlet depot
     * Add if material is same, otherwise replace
     */
    if (MaterialType.get(_outletDepotEntity) == _output.materialType) {
      Amount.set(_outletDepotEntity, Amount.get(_outletDepotEntity) + cumulativeOutputAmount);
    } else {
      MaterialType.set(_outletDepotEntity, _output.materialType);
      Amount.set(_outletDepotEntity, cumulativeOutputAmount);
    }

    // DEBUG
    uint32 consumedInletAmount = cappedBlocks * FLOW_RATE;
    // console.log("consumedInletAmount");
    // console.log(consumedInletAmount);

    /*
     * Write to inlet depots
     * Empty depot if we exhausted it
     */
    for (uint i; i < usedInletAmounts.length; i++) {
      if (consumedInletAmount == usedInletAmounts[i].amount) {
        MaterialType.set(_inletDepotEntities[usedInletAmounts[i].index], MATERIAL_TYPE.NONE);
        Amount.set(_inletDepotEntities[usedInletAmounts[i].index], 0);
      } else {
        Amount.set(_inletDepotEntities[usedInletAmounts[i].index], usedInletAmounts[i].amount - consumedInletAmount);
      }
    }
  }

  function findLowestValue(
    InletDepotAmount[] memory inletDepotAmounts
  ) internal pure returns (InletDepotAmount memory) {
    // Check if the array is empty, return a default struct
    require(inletDepotAmounts.length > 0, "Array is empty");

    InletDepotAmount memory lowest = inletDepotAmounts[0]; // Initialize with the first struct in the array

    for (uint i = 1; i < inletDepotAmounts.length; i++) {
      // Update lowest if the current struct's amount is less than the current lowest amount
      if (inletDepotAmounts[i].amount < lowest.amount) {
        lowest = inletDepotAmounts[i];
      }
    }

    return lowest;
  }

  function getUsedInletAmounts(
    bool[2] memory _inletActive,
    bytes32[2] memory _inletDepotEntities
  ) internal view returns (InletDepotAmount[] memory) {
    InletDepotAmount[2] memory usedInletAmountsTemp;
    uint actualSize = 0;

    for (uint32 i = 0; i < 2; i++) {
      if (_inletActive[i] == false) continue;
      usedInletAmountsTemp[actualSize] = InletDepotAmount(i, Amount.get(_inletDepotEntities[i]));
      actualSize++;
    }

    // Create a new array with the actual size used
    InletDepotAmount[] memory usedInletAmounts = new InletDepotAmount[](actualSize);
    for (uint32 i = 0; i < actualSize; i++) {
      usedInletAmounts[i] = usedInletAmountsTemp[i];
    }

    return usedInletAmounts;
  }
}
