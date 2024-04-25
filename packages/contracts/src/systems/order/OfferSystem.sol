// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, CarriedBy, ContainedMaterial, Offer, OfferData, Amount, TanksInPod, Tutorial, NonTransferableBalance } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibOffer, LibNetwork, PublicMaterials, MaterialId } from "../../libraries/Libraries.sol";
import { TANK_CAPACITY, ONE_UNIT } from "../../constants.sol";

contract OfferSystem is System {
  /**
   * @notice Create an offer
   * @dev Restricted to admin
   * @param _materialId Material id of the offer
   * @param _amount Amount of material in whole units
   * @param _cost Cost of the offer in whole units
   * @return orderEntity Id of the offer entity
   */
  function createOffer(MaterialId _materialId, uint256 _amount, uint256 _cost) public returns (bytes32 orderEntity) {
    //  Restrict to admin
    require(_msgSender() == GameConfig.getAdminAddress(), "not allowed");

    orderEntity = LibOffer.create(_materialId, _amount * ONE_UNIT, _cost * ONE_UNIT);

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
  function buyOffer(bytes32 _offerEntity) public {
    OfferData memory offerData = Offer.get(_offerEntity);

    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    // If player is in tutorial, we check the non transferable balance
    if (Tutorial.get(playerEntity)) {
      require(NonTransferableBalance.get(playerEntity) >= offerData.cost, "insufficient balance");
    } else {
      require(PublicMaterials.BUG.getTokenBalance(_msgSender()) >= offerData.cost, "insufficient balance");
    }

    // Resolution needs to be done before filling the tank to avoid instant conversion of materials.
    LibNetwork.resolve(podEntity);

    bytes32[] memory tanksInPod = TanksInPod.get(podEntity);

    bytes32 targetTank;

    // Go through all tanks in the pod
    for (uint32 i = 0; i < tanksInPod.length; i++) {
      // If tank is empty: select it
      if (!ContainedMaterial.get(tanksInPod[i]).isRegistered()) {
        targetTank = tanksInPod[i];
        break;
      }

      // If tank has other material: skip
      if (ContainedMaterial.get(tanksInPod[i]) != offerData.materialId) {
        continue;
      }

      // If the tank has same material: check if it can hold the amount
      if (Amount.get(tanksInPod[i]) + offerData.amount <= TANK_CAPACITY) {
        targetTank = tanksInPod[i];
        break;
      }
    }

    if (targetTank == bytes32(0)) {
      revert("no tank available");
    }

    // Add material to tank
    ContainedMaterial.set(targetTank, offerData.materialId);
    Amount.set(targetTank, Amount.get(targetTank) + offerData.amount);

    if (Tutorial.get(playerEntity)) {
      // Deduct from non-transferable balance
      NonTransferableBalance.set(playerEntity, NonTransferableBalance.get(playerEntity) - offerData.cost);
    } else {
      // Deduct from real token balance
      PublicMaterials.BUG.transferToken(_world(), offerData.cost);
    }
  }
}
