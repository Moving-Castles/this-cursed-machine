// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, CarriedBy, MaterialType, Offer, OfferData, Amount, DepotsInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOffer, LibToken } from "../../libraries/Libraries.sol";
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";

contract OfferSystem is System {
  function createOffer(MATERIAL_TYPE _materialType, uint32 _amount, uint32 _cost) public returns (bytes32) {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    bytes32 orderEntity = LibOffer.create(_materialType, _amount, _cost);

    return orderEntity;
  }

  function buy(bytes32 _offerEntity) public {
    OfferData memory offerData = Offer.get(_offerEntity);

    require(LibToken.getTokenBalance(_msgSender()) >= offerData.cost, "insufficient balance");

    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Get player's pod entity
    bytes32 podEntity = CarriedBy.get(playerEntity);

    LibToken.transferToken(_world(), _world(), offerData.cost);

    bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);

    /*
     * Go through depots
     * - if it is empty, fill it
     * - if it is the same material, add to it
     */
    for (uint32 i = 0; i < depotsInPod.length; i++) {
      if (MaterialType.get(depotsInPod[i]) == MATERIAL_TYPE.NONE) {
        MaterialType.set(depotsInPod[i], offerData.materialType);
        Amount.set(depotsInPod[i], offerData.amount);
        return;
      } else if (MaterialType.get(depotsInPod[i]) == offerData.materialType) {
        Amount.set(depotsInPod[i], Amount.get(depotsInPod[i]) + offerData.amount);
        return;
      }
    }
  }
}
