// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { MachineType, MaterialType, Recipe } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { Product } from "../structs.sol";

library LibMachine {
  /**
   * @notice Processes products based on the specified machine type and returns the resultant products.
   * @param _machineType The type of the machine to process the products.
   * @param _inputs An array of products to be processed.
   * @return _output An array of resultant products after processing.
   */
  function process(
    MACHINE_TYPE _machineType,
    Product[] memory _inputs
  ) internal view returns (Product[] memory _output) {
    // Player
    if (_machineType == MACHINE_TYPE.PLAYER) {
      return player(_inputs[0]);
    }
    // Splitter
    else if (_machineType == MACHINE_TYPE.SPLITTER) {
      return splitter(_inputs[0]);
    }
    // Mixer
    else if (_machineType == MACHINE_TYPE.MIXER) {
      return mixer(_inputs);
    }
    // DRYER, BOILER, CENTRIFUGE, GRINDER, RAT_CAGE, MEALWORM_VAT
    else if (_machineType >= MACHINE_TYPE.DRYER) {
      return simpleMachine(_machineType, _inputs[0]);
    }
    // Default
    // for MACHINE_TYPE.NONE, MACHINE_TYPE.INLET and MACHINE_TYPE.OUTLET
    return _inputs;
  }

  /**
   * @dev Processes input products
   *
   * @param _input Product to be processed.
   * @return _outputs An array of products output by the player machine.
   */
  function player(Product memory _input) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);

    // Abort if input is not bug
    if (_input.materialType != MATERIAL_TYPE.BUG) return outputs;

    // Output Piss
    outputs[0] = Product({
      machineId: _input.machineId,
      materialType: MATERIAL_TYPE.PISS,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });

    // Output blood
    outputs[1] = Product({
      machineId: _input.machineId,
      materialType: MATERIAL_TYPE.BLOOD,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });

    return outputs;
  }

  /**
   * @dev Splits a single input product into two output products of equal amount.
   *
   * Takes a single input product and produces two output products, each with half
   * the amount of the input.
   *
   * @param _input Product to be processed.
   * @return _outputs An array containing two products, each with half the amount of the input.
   */
  function splitter(Product memory _input) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);

    // Output 1
    outputs[0] = Product({
      machineId: _input.machineId,
      materialType: _input.materialType,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });
    // Output 2
    outputs[1] = Product({
      machineId: _input.machineId,
      materialType: _input.materialType,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });
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

    // Mixer must have 2 inputs
    if (_inputs.length != 2) {
      return outputs;
    }

    MATERIAL_TYPE resultMaterialType = Recipe.get(
      MACHINE_TYPE.MIXER,
      LibUtils.getUniqueIdentifier(uint8(_inputs[0].materialType), uint8(_inputs[1].materialType))
    );

    // Return the lowest amount
    Product memory lowestAmountProduct = getLowestAmountProduct(_inputs[0], _inputs[1]);

    bool[2] memory combinedInletActive = [
      _inputs[0].inletActive[0] || _inputs[1].inletActive[0],
      _inputs[1].inletActive[1] || _inputs[1].inletActive[1]
    ];

    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialType: resultMaterialType,
      amount: lowestAmountProduct.amount,
      inletActive: combinedInletActive
    });
    return outputs;
  }

  /**
   * @notice Processes an input product through a specified machine type, creating an output product.
   * @param _machineType The type of machine to process the input product.
   * @param _input A Product structure detailing the input product's attributes.
   * @return _outputs An array of products representing the output after processing through the machine.
   */
  function simpleMachine(
    MACHINE_TYPE _machineType,
    Product memory _input
  ) internal view returns (Product[] memory _outputs) {
    MATERIAL_TYPE resultMaterialType = Recipe.get(_machineType, uint256(_input.materialType));
    Product[] memory outputs = new Product[](1);

    outputs[0] = Product({
      machineId: _input.machineId,
      materialType: resultMaterialType,
      amount: _input.amount,
      inletActive: _input.inletActive
    });
    return outputs;
  }

  function getLowestAmountProduct(
    Product memory _A,
    Product memory _B
  ) internal pure returns (Product memory _lowestAmountProduct) {
    return _A.amount < _B.amount ? _A : _B;
  }
}
