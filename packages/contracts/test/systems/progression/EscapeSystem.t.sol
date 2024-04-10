// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { IERC721 } from "@latticexyz/world-modules/src/modules/erc721-puppet/IERC721.sol";
import { ROOT_NAMESPACE_ID } from "@latticexyz/world/src/constants.sol";
import { NamespaceOwner } from "@latticexyz/world/src/codegen/tables/NamespaceOwner.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { COMPLETED_ORDERS_THRESHOLDS, POINTS_THRESHOLDS } from "../../../src/constants.sol";

contract EscapeSystemTest is BaseTest {
  function testAllRankNamesExist() public {
    for (
      uint256 completedOrdersRank;
      completedOrdersRank <= COMPLETED_ORDERS_THRESHOLDS().length;
      completedOrdersRank++
    ) {
      for (uint256 pointsRank; pointsRank <= POINTS_THRESHOLDS().length; pointsRank++) {
        string memory rankName = EscapeRankName.get(completedOrdersRank, pointsRank);
        assertGt(bytes(rankName).length, 0);
      }
    }
  }

  function testEscape() public {
    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    world.start();
    vm.stopPrank();

    _skipTutorial(playerEntity);

    vm.startPrank(alice);
    world.name("test name");
    world.escapePod();
    vm.stopPrank();

    assertEq(CarriedBy.get(playerEntity), bytes32(0));

    uint256 tokenId = uint256(GameConfig.getGlobalEscapeIndex());
    IERC721 escapedStumpToken = IERC721(GameConfig.getEscapedStumpTokenAddress());
    assertEq(escapedStumpToken.ownerOf(tokenId), alice);
    assertEq(EscapeIndexRanked.get(0, 0), 1);
  }

  function _skipTutorial(bytes32 _playerEntity) private adminPrank {
    TutorialLevel.set(_playerEntity, 3);
  }
}
