// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, EntityType, EntityTypeTableId, Active, ActiveTableId } from "../codegen/Tables.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibBox {

    function getBoxesByLevel(uint32 _level) internal view returns (bytes32[][] memory boxes) {
        QueryFragment[] memory fragments = new QueryFragment[](2);
        fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encode(ENTITY_TYPE.BOX));
        fragments[1] = QueryFragment(
        QueryType.HasValue,
        LevelTableId,
        Level.encode(_level)
        );
        bytes32[][] memory keyTuples = query(fragments);
        return keyTuples;
    }

    function getInactiveBoxesByLevel(uint32 _level) internal view returns (bytes32[][] memory boxes) {
        QueryFragment[] memory fragments = new QueryFragment[](3);
        fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encode(ENTITY_TYPE.BOX));
        fragments[1] = QueryFragment(
        QueryType.HasValue,
        LevelTableId,
        Level.encode(_level)
        );
        fragments[2] = QueryFragment(QueryType.HasValue, ActiveTableId, Active.encode(false));
        bytes32[][] memory keyTuples = query(fragments);
        return keyTuples;
    }
}