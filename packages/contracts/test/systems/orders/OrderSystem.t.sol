// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_HOUR } from "../../../src/constants.sol";

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

contract OrderSystemTest is BaseTest {
  using WorldResourceIdInstance for ResourceId;

  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
  bytes32[] tutorialLevels;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    depotsInPod = DepotsInPod.get(podEntity);

    tutorialLevels = TutorialOrders.get();

    vm.stopPrank();
  }

  function testCreateOrder() public {
    setUp();

    // !!! This should be limited to admin

    vm.startPrank(alice);

    // Create order
    startGasReport("Create order");
    world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);
    endGasReport();

    vm.stopPrank();
  }

  function testRevertPlayerInTutorial() public {
    setUp();

    // !!! This should be limited to admin

    vm.startPrank(alice);

    // Create order
    bytes32 orderEntity = world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);

    vm.expectRevert("player in tutorial");
    world.accept(orderEntity);

    vm.stopPrank();
  }

  function testAcceptOrder() public {
    setUp();

    // !!! This should be limited to admin

    vm.startPrank(alice);

    // Create order
    bytes32 orderEntity = world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);

    // Fast forward out of tutorial
    world.graduate();

    startGasReport("Accept order");
    world.accept(orderEntity);
    endGasReport();

    vm.stopPrank();

    assertEq(CurrentOrder.get(podEntity), orderEntity);
  }

  function testBuy() public {
    setUp();

    // !!! This should be limited to admin

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    startGasReport("Buy bugs");
    world.buy();
    endGasReport();

    vm.stopPrank();
  }
}
