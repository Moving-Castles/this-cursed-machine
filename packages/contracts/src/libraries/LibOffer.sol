// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { EntityType, Offer, OfferData } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE } from "../codegen/common.sol";

library LibOffer {
  function create(MATERIAL_TYPE _materialType, uint32 _amount, uint32 _cost) internal returns (bytes32) {
    bytes32 offerEntity = getUniqueEntity();
    EntityType.set(offerEntity, ENTITY_TYPE.OFFER);

    Offer.set(
      offerEntity,
      OfferData({ creationBlock: block.number, materialType: _materialType, amount: _amount, cost: _cost })
    );

    return offerEntity;
  }
}
