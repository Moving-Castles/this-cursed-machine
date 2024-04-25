// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Recipe } from "../../codegen/index.sol";
import { MACHINE_TYPE } from "../../codegen/common.sol";
import { LibMaterial, MaterialId } from "../LibMaterial.sol";

library LibAddRecipe {
  function player(MaterialId _input, MaterialId[2] memory _output) internal {
    Recipe.set(MACHINE_TYPE.PLAYER, _parseInput(_input), _parseOutput(_output));
  }

  function mixer(MaterialId[2] memory _input, MaterialId _output) internal {
    Recipe.set(MACHINE_TYPE.MIXER, _parseInput(_input), _parseOutput(_output));
  }

  function dryer(MaterialId _input, MaterialId _output) internal {
    Recipe.set(MACHINE_TYPE.DRYER, _parseInput(_input), _parseOutput(_output));
  }

  function boiler(MaterialId _input, MaterialId _output) internal {
    Recipe.set(MACHINE_TYPE.BOILER, _parseInput(_input), _parseOutput(_output));
  }

  function centrifuge(MaterialId _input, MaterialId[2] memory _output) internal {
    Recipe.set(MACHINE_TYPE.CENTRIFUGE, _parseInput(_input), _parseOutput(_output));
  }

  function grinder(MaterialId _input, MaterialId[2] memory _output) internal {
    Recipe.set(MACHINE_TYPE.GRINDER, _parseInput(_input), _parseOutput(_output));
  }

  function ratCage(MaterialId _input, MaterialId[2] memory _output) internal {
    Recipe.set(MACHINE_TYPE.RAT_CAGE, _parseInput(_input), _parseOutput(_output));
  }

  function mealwormVat(MaterialId _input, MaterialId[2] memory _output) internal {
    Recipe.set(MACHINE_TYPE.MEALWORM_VAT, _parseInput(_input), _parseOutput(_output));
  }

  /*//////////////////////////////////////////////////////////////
                          PRIVATE UTILS
  //////////////////////////////////////////////////////////////*/

  function _requireRegistered(MaterialId _materialId) private view {
    require(_materialId.isRegistered(), "material does not exist");
  }

  function _requireRegistered(MaterialId[2] memory _materialIds) private view {
    for (uint256 i; i < _materialIds.length; i++) {
      _requireRegistered(_materialIds[i]);
    }
  }

  function _parseInput(MaterialId _materialId) private view returns (bytes32) {
    _requireRegistered(_materialId);

    return LibMaterial.getMaterialCombinationId(_materialId);
  }

  function _parseInput(MaterialId[2] memory _materialIds) private view returns (bytes32) {
    _requireRegistered(_materialIds);

    return LibMaterial.getMaterialCombinationId(_materialIds[0], _materialIds[1]);
  }

  function _parseOutput(MaterialId _materialId) private view returns (bytes14[2] memory _result) {
    _requireRegistered(_materialId);

    _result[0] = _materialId.unwrap();
  }

  function _parseOutput(MaterialId[2] memory _materialIds) private view returns (bytes14[2] memory _result) {
    _requireRegistered(_materialIds);

    _result[0] = _materialIds[0].unwrap();
    _result[1] = _materialIds[1].unwrap();
  }
}
