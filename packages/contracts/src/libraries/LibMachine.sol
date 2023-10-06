// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { Energy, MachineType, MaterialType } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { Product } from "../constants.sol";

library LibMachine {
  /**
   * @notice Processes products based on the specified machine type and returns the resultant products.
   * @param _machineType The type of the machine to process the products.
   * @param _inputs An array of products to be processed.
   * @param _entity The identifier of the entity associated with the process.
   * @param blocksSinceLastResolution The number of blocks since the last network resolution.
   * @return _output An array of resultant products after processing.
   * @dev Supports various machine types like CORE, SPLITTER, MIXER, etc., each leading to a distinct processing pathway.
   */
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
    // Splitter
    if (_machineType == MACHINE_TYPE.SPLITTER) {
      return splitter(_inputs);
    }
    // Mixer
    if (_machineType == MACHINE_TYPE.MIXER) {
      return mixer(_inputs);
    }
    // Dryer
    if (_machineType == MACHINE_TYPE.DRYER) {
      return dryer(_inputs);
    }
    // Wetter
    if (_machineType == MACHINE_TYPE.WETTER) {
      return wetter(_inputs);
    }
    // Boiler
    if (_machineType == MACHINE_TYPE.BOILER) {
      return boiler(_inputs);
    }
    // Cooler
    if (_machineType == MACHINE_TYPE.COOLER) {
      return cooler(_inputs);
    }
    // Default
    // for MACHINE_TYPE.NONE, MACHINE_TYPE.INLET and MACHINE_TYPE.OUTLET
    return _inputs;
  }

  /**
   * @dev Processes input products, updates core energy, and generates new products.
   *
   * The function takes input products and, if a BUG type material is present, it will increase
   * the energy of the `_coreEntity` and produce PISS and BLOOD products as output, each having
   * half the amount of the input BUG product.
   *
   * @param _inputs An array of input products.
   * @param _coreEntity The entity of the core whose energy is to be manipulated.
   * @param blocksSinceLastResolution The number of blocks since the last energy resolution.
   * @return _outputs An array of products output by the core machine.
   */
  function core(
    Product[] memory _inputs,
    bytes32 _coreEntity,
    uint256 blocksSinceLastResolution
  ) internal returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);

    // Abort if input is not bug
    if (_inputs[0].materialType != MATERIAL_TYPE.BUG) return outputs;

    // Update core energy (2 per block)
    Energy.set(_coreEntity, Energy.get(_coreEntity) + 2 * uint32(blocksSinceLastResolution));

    // Output Piss
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: MATERIAL_TYPE.PISS,
      amount: _inputs[0].amount / 2
    });

    // Output blood
    outputs[1] = Product({
      machineId: _inputs[0].machineId,
      materialType: MATERIAL_TYPE.BLOOD,
      amount: _inputs[0].amount / 2
    });

    return outputs;
  }

  /**
   * @dev Splits a single input product into two output products of equal amount.
   *
   * Takes a single input product and produces two output products, each with half
   * the amount of the input. The outputs inherit the properties of the input
   * (i.e., `machineId`, `materialType`).
   *
   * @param _inputs An array containing a single input product to be split.
   * @return _outputs An array containing two products, each with half the amount of the input.
   */
  function splitter(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    // Output 1
    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount / 2
    });
    // Output 2
    outputs[1] = Product({
      machineId: _inputs[0].machineId,
      materialType: _inputs[0].materialType,
      amount: _inputs[0].amount / 2
    });
    return outputs;
  }

  function mixer(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs = _inputs;
    return outputs;
  }

  function dryer(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs = _inputs;
    return outputs;
  }

  function wetter(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs = _inputs;
    return outputs;
  }

  function boiler(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs = _inputs;
    return outputs;
  }

  function cooler(Product[] memory _inputs) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    outputs = _inputs;
    return outputs;
  }
}
