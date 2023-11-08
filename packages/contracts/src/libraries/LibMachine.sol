// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { Energy, MachineType, MaterialType } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibRecipe } from "./LibRecipe.sol";
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
      return core(_inputs[0], _entity, blocksSinceLastResolution);
    }
    // Splitter
    else if (_machineType == MACHINE_TYPE.SPLITTER) {
      return splitter(_inputs[0]);
    }
    // Mixer
    else if (_machineType == MACHINE_TYPE.MIXER) {
      return mixer(_inputs);
    }
    // Dryer, Wetter, Boiler, Cooler
    else if (_machineType >= MACHINE_TYPE.DRYER && _machineType <= MACHINE_TYPE.COOLER) {
      return simpleMachine(_machineType, _inputs[0]);
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
   * @param _input Product to be processed.
   * @param _coreEntity The entity of the core whose energy is to be manipulated.
   * @param blocksSinceLastResolution The number of blocks since the last energy resolution.
   * @return _outputs An array of products output by the core machine.
   */
  function core(
    Product memory _input,
    bytes32 _coreEntity,
    uint256 blocksSinceLastResolution
  ) internal returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);

    // Abort if input is not bug
    if (_input.materialType != MATERIAL_TYPE.BUG) return outputs;

    // Update core energy (2 per block)
    Energy.set(_coreEntity, Energy.get(_coreEntity) + 2 * uint32(blocksSinceLastResolution));

    // Output Piss
    outputs[0] = Product({ machineId: _input.machineId, materialType: MATERIAL_TYPE.PISS, amount: _input.amount / 2 });

    // Output blood
    outputs[1] = Product({ machineId: _input.machineId, materialType: MATERIAL_TYPE.BLOOD, amount: _input.amount / 2 });

    return outputs;
  }

  /**
   * @dev Splits a single input product into two output products of equal amount.
   *
   * Takes a single input product and produces two output products, each with half
   * the amount of the input. The outputs inherit the properties of the input
   * (i.e., `machineId`, `materialType`).
   *
   * @param _input Product to be processed.
   * @return _outputs An array containing two products, each with half the amount of the input.
   */
  function splitter(Product memory _input) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);
    // Output 1
    outputs[0] = Product({ machineId: _input.machineId, materialType: _input.materialType, amount: _input.amount / 2 });
    // Output 2
    outputs[1] = Product({ machineId: _input.machineId, materialType: _input.materialType, amount: _input.amount / 2 });
    return outputs;
  }

  /**
   * @dev Mixes two input products, transforming them into a single output product based on predefined mixing recipes.
   *
   * @param _inputs An array of `Product` structs that are the inputs for the mixer.
   * @return _outputs An array of `Product` structs after being processed by the mixer.
   */
  function mixer(Product[] memory _inputs) internal view returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](1);

    if (_inputs.length != 2) {
      // console.log("ERROR: mixer requires 2 inputs");
      return outputs;
    }

    MATERIAL_TYPE resultMaterialType = LibRecipe.getOutput(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(_inputs[0].materialType), uint8(_inputs[1].materialType))
    );

    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: resultMaterialType,
      amount: _inputs[0].amount
    });
    return outputs;
  }

  /**
   * @notice Processes an input product through a specified machine type, creating an output product.
   * @dev Determines output material type using LibRecipe.getOutput and generates an output product array of length 1.
   * @param _machineType The type of machine to process the input product.
   * @param _input A Product structure detailing the input product's attributes.
   * @return _outputs An array of products representing the output after processing through the machine.
   */
  function simpleMachine(
    MACHINE_TYPE _machineType,
    Product memory _input
  ) internal view returns (Product[] memory _outputs) {
    MATERIAL_TYPE resultMaterialType = LibRecipe.getOutput(_machineType, uint256(_input.materialType));
    Product[] memory outputs = new Product[](1);
    outputs[0] = Product({ machineId: _input.machineId, materialType: resultMaterialType, amount: _input.amount });
    return outputs;
  }
}
