// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { MachineType, Recipe } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibMaterial, MaterialId } from "./LibMaterial.sol";
import { Product } from "../structs.sol";

library LibMachine {
  /**
   * @notice Routes the input products to functions handeling the specific machine type, returning the output products.
   * @param _machineType The type of the machine to process the products.
   * @param _inputs An array of products to be processed.
   * @return _output An array of resultant products after processing.
   */
  function process(
    MACHINE_TYPE _machineType,
    Product[] memory _inputs
  ) internal view returns (Product[] memory _output) {
    // Splitter
    if (_machineType == MACHINE_TYPE.SPLITTER) {
      return splitter(_inputs[0]);
    }
    // Mixer
    else if (_machineType == MACHINE_TYPE.MIXER) {
      return mixer(_inputs);
    }
    // PLAYER, DRYER, BOILER, CENTRIFUGE, GRINDER, RAT_CAGE, MEALWORM_VAT
    else if (_machineType == MACHINE_TYPE.PLAYER || _machineType >= MACHINE_TYPE.DRYER) {
      return defaultMachine(_machineType, _inputs[0]);
    }
    // Default: MACHINE_TYPE.NONE, MACHINE_TYPE.INLET and MACHINE_TYPE.OUTLET
    return _inputs;
  }

  /**
   * @dev Splits a single input product into two output products of equal amount.
   * @param _input Product to be processed.
   * @return _outputs An array containing two products
   */
  function splitter(Product memory _input) internal pure returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](2);

    // Output 1
    outputs[0] = Product({
      machineId: _input.machineId,
      materialId: _input.materialId,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });
    // Output 2
    outputs[1] = Product({
      machineId: _input.machineId,
      materialId: _input.materialId,
      amount: _input.amount / 2,
      inletActive: _input.inletActive
    });
    return outputs;
  }

  /**
   * @notice Mixes two input products, transforming them into a single output product based on a recipe
   * @dev Amount returned will be the lowest of the two inputs
   * @param _inputs An array of products
   * @return _outputs An array of products
   */
  function mixer(Product[] memory _inputs) internal view returns (Product[] memory _outputs) {
    Product[] memory outputs = new Product[](1);

    // Mixer must have 2 inputs
    if (_inputs.length != 2) {
      return outputs;
    }

    bytes14[2] memory resultMaterials = Recipe.get(
      MACHINE_TYPE.MIXER,
      LibMaterial.getMaterialCombinationId(_inputs[0].materialId, _inputs[1].materialId)
    );

    // Return the lowest amount
    Product memory lowestAmountProduct = getLowestAmountProduct(_inputs[0], _inputs[1]);

    // We need to combine the inletActive flags from both inputs
    // If either input has an active inlet, the output will have an active inlet
    bool[2] memory combinedInletActive = [
      _inputs[0].inletActive[0] || _inputs[1].inletActive[0],
      _inputs[0].inletActive[1] || _inputs[1].inletActive[1]
    ];

    outputs[0] = Product({
      machineId: _inputs[0].machineId,
      materialId: MaterialId.wrap(resultMaterials[0]),
      amount: lowestAmountProduct.amount,
      inletActive: combinedInletActive
    });
    return outputs;
  }

  /**
   * @notice Processes a  singleinput product through a specified machine type, creating one ot two output product.
   * @param _machineType The type of machine to process the input product.
   * @param _input Input product
   * @return _outputs An array of output products
   */
  function defaultMachine(
    MACHINE_TYPE _machineType,
    Product memory _input
  ) internal view returns (Product[] memory _outputs) {
    console.log("in defaultMachine");
    console.log(uint8(_machineType));

    bytes14[2] memory resultMaterials = Recipe.get(_machineType, _input.materialId.getMaterialCombinationId());

    for (uint i = 0; i < resultMaterials.length; i++) {
      console.logBytes14(resultMaterials[i]);
    }

    if (!MaterialId.wrap(resultMaterials[1]).isRegistered()) {
      // One output

      Product[] memory outputs = new Product[](1);

      // Output 1
      outputs[0] = Product({
        machineId: _input.machineId,
        materialId: MaterialId.wrap(resultMaterials[0]),
        amount: _input.amount,
        inletActive: _input.inletActive
      });

      return outputs;
    } else {
      // Two outputs

      console.log("Two outputs");

      Product[] memory outputs = new Product[](2);

      // Output 1
      outputs[0] = Product({
        machineId: _input.machineId,
        materialId: MaterialId.wrap(resultMaterials[0]),
        amount: _input.amount / 2,
        inletActive: _input.inletActive
      });

      // Output 2
      outputs[1] = Product({
        machineId: _input.machineId,
        materialId: MaterialId.wrap(resultMaterials[1]),
        amount: _input.amount / 2,
        inletActive: _input.inletActive
      });

      return outputs;
    }
  }

  function getLowestAmountProduct(
    Product memory _A,
    Product memory _B
  ) internal pure returns (Product memory _lowestAmountProduct) {
    return _A.amount < _B.amount ? _A : _B;
  }
}
