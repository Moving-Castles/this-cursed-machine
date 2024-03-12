// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_MINUTE, ONE_HOUR } from "../../../src/constants.sol";

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
  FixedEntitiesData fixedEntities;

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

    fixedEntities = FixedEntities.get(podEntity);

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
    bytes32 orderEntity = world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 1000, 0, ONE_HOUR, 10);

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

  function testShip() public {
    setUp();

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    uint blocksToWait = 100;

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    startGasReport("Ship");
    world.ship(depotsInPod[1]);
    endGasReport();

    vm.stopPrank();
  }

  function testRevertShipOrderExpired() public {
    setUp();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    bytes32 orderEntity = world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BUG, 1000, 0, ONE_MINUTE, 10);

    world.accept(orderEntity);

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.ship(depotsInPod[1]);

    vm.stopPrank();
  }

  function testRevertAcceptOrderExpired() public {
    setUp();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    bytes32 orderEntity = world.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BUG, 1000, 0, ONE_MINUTE, 10);

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.accept(orderEntity);

    vm.stopPrank();
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
