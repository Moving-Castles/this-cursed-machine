// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";

contract DevSystemTest is BaseTest {
  function testRevertNotAllowed() public {
    setUp();

    vm.startPrank(alice);

    vm.expectRevert("not allowed");
    world.devGraduate(alice);

    vm.expectRevert("not allowed");
    world.devFillTank(bytes32(0), 100, PublicMaterials.BUGS);

    vm.expectRevert("not allowed");
    world.devReward(alice);

    vm.stopPrank();
  }
}
