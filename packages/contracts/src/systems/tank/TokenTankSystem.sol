// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, ContainedMaterial, Amount } from "../../codegen/index.sol";
import { ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibNetwork, MaterialId } from "../../libraries/Libraries.sol";
import { TANK_CAPACITY, ONE_UNIT } from "../../constants.sol";

contract TokenTankSystem is System {
  /**
   * @notice Convert material tokens to fill tank
   * @param _tankEntity Id of tank entity
   * @param _amount Amount of material in whole units
   * @param _materialId Material id of the material
   */
  function fillTank(bytes32 _tankEntity, uint256 _amount, MaterialId _materialId) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_tankEntity) == podEntity, "not in pod");
    require(EntityType.get(_tankEntity) == ENTITY_TYPE.TANK, "not tank");
    require(_materialId.isRegistered(), "material does not exist");
    // Allow only empty or same-material tank
    uint256 currentValue = 0;
    MaterialId currentMaterialId = ContainedMaterial.get(_tankEntity);
    if (currentMaterialId.isRegistered()) {
      require(currentMaterialId == _materialId, "tank contains different material");
      currentValue = Amount.get(_tankEntity);
    }
    // Prevent overfilling tank
    uint256 newValue = currentValue + _amount * ONE_UNIT;
    require(newValue <= TANK_CAPACITY, "amount over tank capacity");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Fill tank
    ContainedMaterial.set(_tankEntity, _materialId);
    Amount.set(_tankEntity, newValue);

    // Burn tokens
    _materialId.burn(_msgSender(), _amount * ONE_UNIT);
  }
}
