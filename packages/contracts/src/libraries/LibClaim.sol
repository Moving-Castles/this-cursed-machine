// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { StartBlock, Energy, GameConfig, GameConfigData, Position, PositionTableId, PositionData, Type, TypeTableId, StartBlock, StartBlockTableId, TargetEntity, SourceEntity} from "../codegen/Tables.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { EntityType } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibMap } from "./LibMap.sol";

library LibClaim {

  function getAllClaims() internal view returns (bytes32[][] memory claims) {
    // TODO: possible use EntityType == EntityType.CLAIM instead of StartBlockTableId
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.Has, StartBlockTableId, new bytes(0));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  function create(bytes32 _sourceEntity, bytes32 _targetEntity) internal {
    bytes32 claimEntity = LibUtils.getRandomKey();
    Type.set(claimEntity, EntityType.CLAIM);
    SourceEntity.set(claimEntity, _sourceEntity);
    TargetEntity.set(claimEntity, _targetEntity);
    StartBlock.set(claimEntity, block.number);
  }

  function settleAll() internal {
    // Get all claims
    bytes32[][] memory claims = getAllClaims();
    // Nothing to settle
    if (claims.length == 0) return;

    for (uint i = 0; i < claims.length; i++) {
      bytes32 claimId = claims[i][0];
      uint32 blocksSinceSettlement = uint32(block.number - StartBlock.get(claimId));
      // TODO: take into account number of connections to resource
      uint32 earnedEnergy = blocksSinceSettlement;

      // Set energy to current value + earned energy, clamp to config cap
      Energy.set(
        SourceEntity.get(claimId),
        LibUtils.clamp(Energy.get(SourceEntity.get(claimId)) + earnedEnergy, GameConfig.get().coreEnergyCap)
      );

      // Set start block to current block
      StartBlock.set(claimId, block.number);
    }
  }
  
}
