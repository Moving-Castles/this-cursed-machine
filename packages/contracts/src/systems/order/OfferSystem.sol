// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, CarriedBy, MaterialType, Offer, OfferData, Amount, DepotsInPod, Tutorial, NonTransferableBalance } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOffer, LibToken, LibNetwork } from "../../libraries/Libraries.sol";
import { DEPOT_CAPACITY, ONE_TOKEN_UNIT } from "../../constants.sol";

contract OfferSystem is System {
  /**
   * @notice Create an offer
   * @dev Restricted to admin
   * @param _materialType Material type of the offer
   * @param _amount Amount of material
   * @param _cost Cost of the offer in whole token units (1 token = 1e18)
   * @return orderEntity Id of the offer entity
   */
  function createOffer(MATERIAL_TYPE _materialType, uint32 _amount, uint32 _cost) public returns (bytes32 orderEntity) {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    orderEntity = LibOffer.create(_materialType, _amount, _cost);

    return orderEntity;
  }

  /**
   * @notice Cancel an offer
   * @dev Restricted to admin
   * @param _offerEntity Id of the offer entity
   */
  function cancelOffer(bytes32 _offerEntity) public {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    LibOffer.destroy(_offerEntity);
  }

  /**
   * @notice Buy an offer
   * @dev Resolves network after buying
   * @param _offerEntity Id of the offer entity
   */
  function buy(bytes32 _offerEntity) public {
    OfferData memory offerData = Offer.get(_offerEntity);

    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    // If player is in tutorial, we check the non transferable balance
    if (Tutorial.get(playerEntity)) {
      require(NonTransferableBalance.get(playerEntity) > offerData.cost, "insufficient balance");
    } else {
      require(LibToken.getTokenBalance(_msgSender()) > offerData.cost * ONE_TOKEN_UNIT, "insufficient balance");
    }

    // Resolution needs to be done before filling the depot to avoid instant conversion of materials.
    LibNetwork.resolve(podEntity);

    bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);

    bytes32 targetDepot;

    // Go through all depots in the pod
    for (uint32 i = 0; i < depotsInPod.length; i++) {
      // If depot is empty: select it
      if (MaterialType.get(depotsInPod[i]) == MATERIAL_TYPE.NONE) {
        targetDepot = depotsInPod[i];
        break;
      }

      // If depot has other material: skip
      if (MaterialType.get(depotsInPod[i]) != offerData.materialType) {
        continue;
      }

      // If the depot has same material: check if it can hold the amount
      if (Amount.get(depotsInPod[i]) + offerData.amount <= DEPOT_CAPACITY) {
        targetDepot = depotsInPod[i];
        break;
      }
    }

    if (targetDepot == bytes32(0)) {
      revert("no tank available");
    }

    // Add material to depot
    MaterialType.set(targetDepot, offerData.materialType);
    Amount.set(targetDepot, Amount.get(targetDepot) + offerData.amount);

    if (Tutorial.get(playerEntity)) {
      // Deduct from non-transferable balance
      NonTransferableBalance.set(playerEntity, NonTransferableBalance.get(playerEntity) - offerData.cost);
    } else {
      // Deduct from real token balance
      LibToken.transferToken(_world(), offerData.cost * ONE_TOKEN_UNIT);
    }
  }
}
