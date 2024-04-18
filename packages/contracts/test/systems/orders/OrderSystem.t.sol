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
    playerEntity = world.spawn("alice");
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    depotsInPod = DepotsInPod.get(podEntity);

    fixedEntities = FixedEntities.get(podEntity);

    vm.stopPrank();
  }

  function testCreateOrderAsAdmin() public {
    setUp();

    prankAdmin();
    // Create order
    startGasReport("Create order as admin");
    world.createOrder("", MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);
    endGasReport();

    vm.stopPrank();
  }

  function testRevertCreateOrderAsNormalUser() public {
    setUp();

    vm.startPrank(alice);

    world.reward();

    // Create order
    startGasReport("Create order as normal user");
    world.createOrder("Test order", MATERIAL_TYPE.BLOOD_MEAL, 100000, 100, ONE_HOUR, 1);
    endGasReport();

    vm.stopPrank();
  }

  function testRevertCreateOrderInsufficientFunds() public {
    setUp();

    vm.startPrank(alice);

    // Create order
    vm.expectRevert("insufficient funds");
    world.createOrder("", MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);

    vm.stopPrank();
  }

  function testRevertMaxPlayersReached() public {
    setUp();

    // Create order
    prankAdmin();
    bytes32 order = world.createOrder("", MATERIAL_TYPE.NONE, 0, 1000, ONE_HOUR, 1);
    vm.stopPrank();

    vm.startPrank(alice);
    world.graduate();
    world.accept(order);
    world.ship(depotsInPod[1]);
    vm.stopPrank();

    vm.startPrank(bob);
    // Spawn player
    bytes32 bobEntity = world.spawn("alice");
    world.start();
    bytes32 bobPodEntity = CarriedBy.get(bobEntity);
    bytes32[] memory bobDepotsInPod = DepotsInPod.get(bobPodEntity);
    world.graduate();
    world.accept(order);
    vm.expectRevert("max players reached");
    world.ship(bobDepotsInPod[1]);
    vm.stopPrank();
  }

  function testRevertPlayerInTutorial() public {
    setUp();

    prankAdmin();
    // Create order
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BLOOD_MEAL, 1000, 0, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    vm.expectRevert("not tutorial order");
    world.accept(orderEntity);

    vm.stopPrank();
  }

  function testAcceptAndUnacceptOrder() public {
    setUp();

    // Create order
    prankAdmin();
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    startGasReport("Accept order");
    world.accept(orderEntity);
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), orderEntity);

    startGasReport("Unaccept order");
    world.unaccept();
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), bytes32(0));

    vm.stopPrank();
  }

  function testShip() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BLOOD, 2000, 1000, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    world.graduate();

    world.accept(orderEntity);

    world.fillDepot(depotsInPod[0], 10000, MATERIAL_TYPE.BUG);

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

    assertEq(CurrentOrder.get(playerEntity), bytes32(0));
    // assertEq(EarnedPoints.get(playerEntity), 1000);
    assertEq(Completed.get(orderEntity)[0], playerEntity);
    assertEq(Completed.get(playerEntity)[0], orderEntity);

    vm.stopPrank();
  }

  function testRevertShipOrderExpired() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    world.accept(orderEntity);

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.ship(depotsInPod[1]);

    vm.stopPrank();
  }

  function testRevertAcceptOrderExpired() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.accept(orderEntity);

    vm.stopPrank();
  }

  function testRevertOrderAlreadyCompleted() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", MATERIAL_TYPE.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    world.fillDepot(depotsInPod[0], 10000, MATERIAL_TYPE.BUG);

    world.accept(orderEntity);

    world.ship(depotsInPod[0]);

    vm.expectRevert("order already completed");
    world.accept(orderEntity);

    vm.stopPrank();
  }
}
