// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { TANK_CAPACITY } from "../../../src/constants.sol";

contract GraduateSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] tanksInPod;
  bytes32[] tutorialLevels;
  FixedEntitiesData fixedEntities;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn("alice");
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    tanksInPod = TanksInPod.get(podEntity);

    fixedEntities = FixedEntities.get(podEntity);

    vm.stopPrank();
  }

  function testGraduate() public {
    setUp();

    vm.startPrank(alice);

    // startGasReport("Graduate");
    vm.expectRevert("not allowed");
    world.graduate();
    // endGasReport();

    vm.stopPrank();

    // // Check that first tank contains TANK_CAPACITY bugs
    // assertEq(Tutorial.get(playerEntity), false);
    // // No matching declaration found after argument-dependent lookup.solidity(9322)
    // // assertEq(ContainedMaterial.get(tanksInPod[0]), PublicMaterials.BUGS);
    // assertEq(Amount.get(tanksInPod[0]), TANK_CAPACITY);

    // // Check that tanks are empty
    // for (uint32 i = 1; i < tanksInPod.length; i++) {
    //   // No matching declaration found after argument-dependent lookup.solidity(9322)
    //   // assertEq(ContainedMaterial.get(tanksInPod[i]), LibMaterial.NONE);
    //   assertEq(Amount.get(tanksInPod[i]), 0);
    // }
  }

  // function testRevertDoubleGraduate() public {
  //   setUp();

  //   vm.startPrank(alice);

  //   world.graduate();
  //   vm.expectRevert("not in tutorial");
  //   world.graduate();

  //   vm.stopPrank();
  // }
}
