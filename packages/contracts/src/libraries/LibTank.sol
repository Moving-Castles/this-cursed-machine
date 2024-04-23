// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, TankConnection, BuildIndex } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { Product } from "../structs.sol";
import { FLOW_RATE, TANK_CAPACITY } from "../constants.sol";

library LibTank {
  struct InletTankAmount {
    uint32 index;
    uint32 amount;
  }

  /**
   * @notice Create a new tank
   * @param _podEntity The id of the pod entity
   * @return tankEntity The id of the tank entity
   */
  function create(bytes32 _podEntity, uint32 _index) internal returns (bytes32 tankEntity) {
    tankEntity = getUniqueEntity();
    EntityType.set(tankEntity, ENTITY_TYPE.TANK);
    CarriedBy.set(tankEntity, _podEntity);
    MaterialType.set(tankEntity, MATERIAL_TYPE.NONE);
    Amount.set(tankEntity, 0);
    BuildIndex.set(tankEntity, _index + 1);
    TankConnection.set(tankEntity, bytes32(0));
    return tankEntity;
  }

  /**
   * @notice Update tanks based on the result of a network resolution
   * @param _inletTankEntities The ids of the inlet tank entities
   * @param _outletTankEntity The id of the outlet tank entity
   * @param _blocksSinceLastResolution The number of blocks since the last resolution
   * @param _output The output product of the outlet
   */
  function write(
    bytes32[2] memory _inletTankEntities,
    bytes32 _outletTankEntity,
    uint256 _blocksSinceLastResolution,
    Product memory _output
  ) internal {
    /*
     * This function updates the inlet and outlet tanks
     *
     * Generally the output is what is produced by the outlet machine * blocks past
     *
     * But, we need to take into account the following limiting factors:
     * - The amount of material in the inlet tanks
     * - The capacity of the outlet tank
     *
     * We need to find the lowest of the two limiting factors and cap the number of blocks by that
     */

    InletTankAmount[] memory usedInletAmounts = getUsedInletTanks(_output.inletActive, _inletTankEntities);
    InletTankAmount memory lowestInput = findLowestValue(usedInletAmounts);

    /*
     * With a flow rate of FLOW_RATE per block,
     * how long does it take for the lowest input to be exhausted?
     */
    uint32 inletExhaustionBlock = lowestInput.amount / FLOW_RATE;

    /*
     * When is the outlet tank full?
     * available capacity of the tank / flow rate of the outlet product
     */
    uint32 outletFullBlock = (TANK_CAPACITY - Amount.get(_outletTankEntity)) / _output.amount;

    /*
     * Stop block is the lowest of the two limiting factors
     */
    uint32 stopBlock = inletExhaustionBlock > outletFullBlock ? outletFullBlock : inletExhaustionBlock;

    uint32 cappedBlocks = stopBlock > uint32(_blocksSinceLastResolution)
      ? uint32(_blocksSinceLastResolution)
      : stopBlock;

    /*
     * Write to outlet tank
     * Add if material is same, otherwise replace
     */

    uint32 cumulativeOutputAmount = _output.amount * cappedBlocks;

    if (MaterialType.get(_outletTankEntity) == _output.materialType) {
      Amount.set(_outletTankEntity, Amount.get(_outletTankEntity) + cumulativeOutputAmount);
    } else {
      MaterialType.set(_outletTankEntity, _output.materialType);
      Amount.set(_outletTankEntity, cumulativeOutputAmount);
    }

    /*
     * Write to inlet tanks
     * Empty tank if we exhausted it
     */

    uint32 consumedInletAmount = cappedBlocks * FLOW_RATE;

    for (uint i = 0; i < usedInletAmounts.length; i++) {
      uint32 newAmount = usedInletAmounts[i].amount > consumedInletAmount
        ? usedInletAmounts[i].amount - consumedInletAmount
        : 0;
      if (newAmount == 0) {
        MaterialType.set(_inletTankEntities[usedInletAmounts[i].index], MATERIAL_TYPE.NONE);
      }
      Amount.set(_inletTankEntities[usedInletAmounts[i].index], newAmount);
    }
  }

  /**
   * @notice Find the struct with the lowest amount in an array of structs
   * @param inletTankAmounts The array of structs to search
   * @return The struct with the lowest amount
   */
  function findLowestValue(InletTankAmount[] memory inletTankAmounts) internal pure returns (InletTankAmount memory) {
    // Revert if the array is empty
    require(inletTankAmounts.length > 0, "Array is empty");

    InletTankAmount memory lowest = inletTankAmounts[0]; // Initialize with the first struct in the array

    for (uint i = 1; i < inletTankAmounts.length; i++) {
      // Update lowest if the current struct's amount is less than the current lowest amount
      if (inletTankAmounts[i].amount < lowest.amount) {
        lowest = inletTankAmounts[i];
      }
    }

    return lowest;
  }

  /**
   * @notice Get tanks that are connected to inlets that contribute to the final output
   * @dev Based on the flags (_inletActive) set on the outlet product struct
   * @param _inletActive The array of bools indicating if the inlets are active
   * @param _inletTankEntities The array of inlet tank entities
   * @return An array of structs of used tanks
   */
  function getUsedInletTanks(
    bool[2] memory _inletActive,
    bytes32[2] memory _inletTankEntities
  ) internal view returns (InletTankAmount[] memory) {
    InletTankAmount[2] memory usedInletAmountsTemp;
    uint actualSize = 0;

    for (uint32 i = 0; i < 2; i++) {
      if (_inletActive[i] == false) continue;
      usedInletAmountsTemp[actualSize] = InletTankAmount(i, Amount.get(_inletTankEntities[i]));
      actualSize++;
    }

    // Create a new array with the actual size used
    InletTankAmount[] memory usedInletAmounts = new InletTankAmount[](actualSize);
    for (uint32 i = 0; i < actualSize; i++) {
      usedInletAmounts[i] = usedInletAmountsTemp[i];
    }

    return usedInletAmounts;
  }
}
