// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";

contract GraduateSystemTest is BaseTest {
  function testGraduate() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn("alice");
    world.start();

    startGasReport("Graduate");
    world.graduate();
    endGasReport();

    vm.stopPrank();

    assertEq(Tutorial.get(playerEntity), false);
  }

  function testRevertDoubleGraduate() public {
    setUp();

    vm.startPrank(alice);
    world.spawn("alice");
    world.start();

    world.graduate();
    vm.expectRevert("not in tutorial");
    world.graduate();

    vm.stopPrank();
  }
}
