// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, CarriedBy, MaterialType, Offer, OfferData, Amount, DepotsInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOffer, LibToken, LibNetwork } from "../../libraries/Libraries.sol";

contract OfferSystem is System {
  /**
   * @notice Create an offer
   * @dev Restricted to admin
   * @param _materialType Material type of the offer
   * @param _amount Amount of material
   * @param _cost Cost of the offer
   * @return orderEntity Id of the offer entity
   */
  function createOffer(MATERIAL_TYPE _materialType, uint32 _amount, uint32 _cost) public returns (bytes32 orderEntity) {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    orderEntity = LibOffer.create(_materialType, _amount, _cost);

    return orderEntity;
  }

  /**
   * @notice Buy an offer
   * @dev Resolves network after buying
   * @param _offerEntity Id of the offer entity
   */
  function buy(bytes32 _offerEntity) public {
    OfferData memory offerData = Offer.get(_offerEntity);

    require(LibToken.getTokenBalance(_msgSender()) >= offerData.cost, "insufficient balance");

    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    LibToken.transferToken(_world(), offerData.cost);

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
        break;
      } else if (MaterialType.get(depotsInPod[i]) == offerData.materialType) {
        Amount.set(depotsInPod[i], Amount.get(depotsInPod[i]) + offerData.amount);
        break;
      }
    }

    LibNetwork.resolve(podEntity);
  }
}
