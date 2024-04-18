// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

contract RewardSystemTest is BaseTest {
  function testReward() public {
    setUp();

    vm.startPrank(alice);
    world.reward();
    vm.stopPrank();

    assertEq(PublicMaterials.BUG.getTokenBalance(worldAddress), 0);
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 1000);
  }

  function testCharge() public {
    setUp();

    vm.startPrank(alice);
    world.reward();

    assertEq(PublicMaterials.BUG.getTokenBalance(worldAddress), 0);
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 1000);

    world.charge();

    assertEq(PublicMaterials.BUG.getTokenBalance(worldAddress), 100);
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 900);

    vm.stopPrank();
  }

  function testGraduate() public {
    setUp();

    vm.startPrank(alice);
    world.graduate();

    assertEq(PublicMaterials.BUG.getTokenBalance(worldAddress), 0);
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 10000);

    vm.stopPrank();
  }

  function testRevertInsufficientBalance() public {
    setUp();

    vm.startPrank(alice);

    vm.expectRevert("insufficient balance");
    world.charge();

    vm.stopPrank();
  }
}
