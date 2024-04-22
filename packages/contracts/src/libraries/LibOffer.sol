// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, Offer, OfferData } from "../codegen/index.sol";
import { ENTITY_TYPE } from "../codegen/common.sol";
import { MaterialId } from "./LibMaterial.sol";

library LibOffer {
  /**
   * @notice Create a new offer
   * @param _materialId Material id of the offer
   * @param _amount Amount of material in the offer
   * @param _cost Cost of the offer
   * @return offerEntity The id of the offer entity.
   */
  function create(MaterialId _materialId, uint32 _amount, uint32 _cost) internal returns (bytes32 offerEntity) {
    offerEntity = getUniqueEntity();
    EntityType.set(offerEntity, ENTITY_TYPE.OFFER);

    Offer.set(offerEntity, OfferData({ materialId: _materialId, amount: _amount, cost: _cost }));

    return offerEntity;
  }

  /**
   * @notice Destroy an offer
   * @param _offerEntity Id of the offer entity
   */
  function destroy(bytes32 _offerEntity) internal {
    Offer.deleteRecord(_offerEntity);
  }
}
