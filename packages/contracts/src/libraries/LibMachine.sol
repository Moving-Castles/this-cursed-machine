// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { GameConfig, GameConfigData, Level, Energy, LevelTableId, Name, CreationBlock, ReadyBlock, EntityType, EntityTypeTableId, Active, ActiveTableId, Rotation, MachineType, MaterialType } from "../codegen/Tables.sol";
import { ENTITY_TYPE, MACHINE_TYPE, ROTATION, MATERIAL_TYPE } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";
import { Product } from "../constants.sol";

library LibMachine {
  function process(
    MACHINE_TYPE _machineType,
    Product[] memory _inputs,
    bytes32 _entity,
    uint256 blocksSinceLastResolution
  ) internal returns (Product[] memory _output) {
    // Core
    if (_machineType == MACHINE_TYPE.CORE) {
      return core(_inputs, _entity, blocksSinceLastResolution);
    }
    // Scorcher
    if (_machineType == MACHINE_TYPE.SCORCHER) {
      return scorcher(_inputs);
    }
    // Splitter
    if (_machineType == MACHINE_TYPE.SPLITTER) {
      return splitter(_inputs);
    }
    // Blender
    if (_machineType == MACHINE_TYPE.BLENDER) {
      return blender(_inputs);
    }
    // CombiGate
    if (_machineType == MACHINE_TYPE.COMBI_GATE) {
      return combiGate(_inputs);
    }
    // Default
    return _inputs;
  }

  /**
   * @notice Converts a pellet into products of type "PISS" and "BLOOD".
   *
   * @notice Inputs = 1
   * @notice Outputs = 2
   * TODO: Update core energy (factor: 0.2)
   *
   * @param _inputs Array of Product structs, each containing machineId, materialType, amount, and temperature.
   * @return _outputs Array of modified Product structs with types "PISS" and "BLOOD".
   */
  function core(
    Product[] memory _inputs,
    bytes32 _coreEntity,
    uint256 blocksSinceLastResolution
  ) internal returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    // Abort if not pellet
    if (_inputs[0].materialType != MATERIAL_TYPE.PELLET) return outputs;
    // Update core energy (factor: 0.2)
    Energy.set(_coreEntity, Energy.get(_coreEntity) + uint32(blocksSinceLastResolution));
    // Output Piss
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: MATERIAL_TYPE.PISS,
      amount: _inputs[0].amount / 2,
      temperature: _inputs[0].temperature
    });
    // Output blood
    outputs[1] = Product({
      machineId: _inputs[0].machineId,
      materialType: MATERIAL_TYPE.BLOOD,
      amount: _inputs[0].amount / 2,
      temperature: _inputs[0].temperature
    });
    return outputs;
  }

  /**
   * @notice Increases the temperature of the give product by 30 units.
   *
   * @notice Inputs = 1
   * @notice Outputs = 1
   *
   * @param _inputs Array of Product structs
   * @return _outputs Array of modified Product structs with increased temperatures.
   */
  function scorcher(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount,
      temperature: _inputs[0].temperature + 30
    });
    return outputs;
  }

  /**
   * @notice Splits a given product into two products with half the amount of the original.
   *
   * @notice Inputs = 1
   * @notice Outputs = 2
   *
   * @param _inputs Array of Product structs, each containing machineId, materialType, amount, and temperature.
   * @return _outputs Array of two Product structs with halved amounts.
   */
  function splitter(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    // Output 1
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount / 2,
      temperature: _inputs[0].temperature
    });
    // Output 2
    outputs[1] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount / 2,
      temperature: _inputs[0].temperature
    });
    return outputs;
  }

  function blender(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: MATERIAL_TYPE.DIRT,
      amount: _inputs[0].amount,
      temperature: _inputs[0].temperature
    });

    // 1: BLOOD + PISS = TEETH
    if (
      (_inputs[0].materialType == MATERIAL_TYPE.BLOOD && _inputs[1].materialType == MATERIAL_TYPE.PISS) ||
      (_inputs[0].materialType == MATERIAL_TYPE.PISS && _inputs[1].materialType == MATERIAL_TYPE.BLOOD)
    ) {
      outputs[0].materialType = MATERIAL_TYPE.TEETH;
    }
    return outputs;
  }

  /**
   * @notice NOT DONE
   */
  function combiGate(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    //@todo: NOT DONE
    Product[] memory outputs = new Product[](2);
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount,
      temperature: _inputs[0].temperature
    });
    return outputs;
  }
}
