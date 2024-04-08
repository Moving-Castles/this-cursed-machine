// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";
import { FLOW_RATE, DEPOT_CAPACITY } from "../constants.sol";

library LibDepot {
  struct InletDepotAmount {
    uint32 index;
    uint32 amount;
  }

  /**
   * @notice Create a new depot
   * @param _podEntity The id of the pod entity
   * @return depotEntity The id of the depot entity
   */
  function create(bytes32 _podEntity, uint32 _index) internal returns (bytes32 depotEntity) {
    depotEntity = getUniqueEntity();
    EntityType.set(depotEntity, ENTITY_TYPE.DEPOT);
    CarriedBy.set(depotEntity, _podEntity);
    MaterialType.set(depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(depotEntity, 0);
    BuildIndex.set(depotEntity, _index + 1);
    DepotConnection.set(depotEntity, bytes32(0));
    return depotEntity;
  }

  /**
   * @notice Update depots based on the result of a network resolution
   * @param _inletDepotEntities The ids of the inlet depot entities
   * @param _outletDepotEntity The id of the outlet depot entity
   * @param _blocksSinceLastResolution The number of blocks since the last resolution
   * @param _output The output product of the outlet
   */
  function write(
    bytes32[2] memory _inletDepotEntities,
    bytes32 _outletDepotEntity,
    uint256 _blocksSinceLastResolution,
    Product memory _output
  ) internal {
    /*
     * This function updates the inlet and outlet depots
     *
     * Generally the output is what is produced by the outlet machine * blocks past
     *
     * But, we need to take into account the following limiting factors:
     * - The amount of material in the inlet depots
     * - The capacity of the outlet depot
     *
     * We need to find the lowest of the two limiting factors and cap the number of blocks by that
     */

    InletDepotAmount[] memory usedInletAmounts = getUsedInletDepots(_output.inletActive, _inletDepotEntities);
    InletDepotAmount memory lowestInput = findLowestValue(usedInletAmounts);

    /*
     * With a flow rate of FLOW_RATE per block,
     * how long does it take for the lowest input to be exhausted?
     */
    uint32 inletExhaustionBlock = lowestInput.amount / FLOW_RATE;

    /*
     * When is the outlet depot full?
     * available capacity of the depot / flow rate of the outlet product
     */
    uint32 outletFullBlock = (DEPOT_CAPACITY - Amount.get(_outletDepotEntity)) / _output.amount;

    /*
     * Stop block is the lowest of the two limiting factors
     */
    uint32 stopBlock = inletExhaustionBlock > outletFullBlock ? outletFullBlock : inletExhaustionBlock;

    uint32 cappedBlocks = stopBlock > uint32(_blocksSinceLastResolution)
      ? uint32(_blocksSinceLastResolution)
      : stopBlock;

    /*
     * Write to outlet depot
     * Add if material is same, otherwise replace
     */

    uint32 cumulativeOutputAmount = _output.amount * cappedBlocks;

    if (MaterialType.get(_outletDepotEntity) == _output.materialType) {
      Amount.set(_outletDepotEntity, Amount.get(_outletDepotEntity) + cumulativeOutputAmount);
    } else {
      MaterialType.set(_outletDepotEntity, _output.materialType);
      Amount.set(_outletDepotEntity, cumulativeOutputAmount);
    }

    /*
     * Write to inlet depots
     * Empty depot if we exhausted it
     */

    uint32 consumedInletAmount = cappedBlocks * FLOW_RATE;

    for (uint i = 0; i < usedInletAmounts.length; i++) {
      uint32 newAmount = usedInletAmounts[i].amount > consumedInletAmount
        ? usedInletAmounts[i].amount - consumedInletAmount
        : 0;
      if (newAmount == 0) {
        MaterialType.set(_inletDepotEntities[usedInletAmounts[i].index], MATERIAL_TYPE.NONE);
      }
      Amount.set(_inletDepotEntities[usedInletAmounts[i].index], newAmount);
    }
  }

  /**
   * @notice Find the struct with the lowest amount in an array of structs
   * @param inletDepotAmounts The array of structs to search
   * @return The struct with the lowest amount
   */
  function findLowestValue(
    InletDepotAmount[] memory inletDepotAmounts
  ) internal pure returns (InletDepotAmount memory) {
    // Revert if the array is empty
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

  /**
   * @notice Get depots that are connected to inlets that contribute to the final output
   * @dev Based on the flags (_inletActive) set on the outlet product struct
   * @param _inletActive The array of bools indicating if the inlets are active
   * @param _inletDepotEntities The array of inlet depot entities
   * @return An array of structs of used depots
   */
  function getUsedInletDepots(
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
