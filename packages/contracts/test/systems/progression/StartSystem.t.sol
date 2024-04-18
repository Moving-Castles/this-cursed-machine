// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

contract StartSystemTest is BaseTest {
  function testStart() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn("alice");
    startGasReport("Start");
    bytes32 podEntity = world.start();
    endGasReport();
    vm.stopPrank();

    assertEq(CarriedBy.get(playerEntity), podEntity);
    assertEq(TutorialLevel.get(playerEntity), 0);
  }
}
