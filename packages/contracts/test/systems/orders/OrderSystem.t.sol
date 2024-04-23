// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_MINUTE, ONE_HOUR, ONE_TOKEN_UNIT } from "../../../src/constants.sol";

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

  function setUpBob() public {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn("alice");
    world.start();

    vm.stopPrank();
  }

  function testCreateOrderAsAdmin() public {
    setUp();

    prankAdmin();
    // Create order
    startGasReport("Create order as admin");
    world.createOrder("", PublicMaterials.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);
    endGasReport();

    vm.stopPrank();
  }

  function testCreateOrderAsUser() public {
    /*//////////////////////////////////////////////////////////////
                         BOB CREATES ORDER
    //////////////////////////////////////////////////////////////*/

    setUpBob();
    vm.startPrank(bob);

    // Get bug tokens
    world.reward();

    // Create order
    startGasReport("Create order as user");
    bytes32 testOrder = world.createOrder("Test order", PublicMaterials.PISS, 5000, 5000, ONE_HOUR, 1);
    endGasReport();

    OrderData memory orderData = Order.get(testOrder);

    assertEq(orderData.creator, bob);

    vm.stopPrank();

    /*//////////////////////////////////////////////////////////////
                        ALICE FULLFILLS ORDER
    //////////////////////////////////////////////////////////////*/

    // Setup alice
    setUp();
    vm.startPrank(alice);

    world.graduate();

    // Accept test order
    world.acceptOrder(testOrder);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 20;
    vm.roll(block.number + blocksToWait);

    // Unplug & Ship
    world.unplugTank(tanksInPod[1]);
    world.shipTank(tanksInPod[1]);

    vm.stopPrank();

    // Alice got 10000 BUG tokens for graduating + 50 BUG tokens for completing the order
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 15000 * ONE_TOKEN_UNIT);
    // Bob got 5000 PISS tokens for creating the order
    assertEq(PublicMaterials.PISS.getTokenBalance(bob), 5000 * ONE_TOKEN_UNIT);
  }

  function testRevertCreateOrderInsufficientFunds() public {
    setUp();

    vm.startPrank(alice);

    // Create order
    vm.expectRevert("insufficient funds");
    world.createOrder("", PublicMaterials.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);

    vm.stopPrank();
  }

  function testRevertMaxPlayersReached() public {
    setUp();

    // Create order
    prankAdmin();
    bytes32 order = world.createOrder("", PublicMaterials.BLOOD_MEAL, 0, 1000, ONE_HOUR, 1);
    ContainedMaterial.set(tanksInPod[1], PublicMaterials.BLOOD_MEAL);
    vm.stopPrank();

    vm.startPrank(alice);
    world.graduate();
    world.acceptOrder(order);
    world.shipTank(tanksInPod[1]);
    vm.stopPrank();

    vm.startPrank(bob);
    // Spawn player
    bytes32 bobEntity = world.spawn("alice");
    world.start();
    bytes32 bobPodEntity = CarriedBy.get(bobEntity);
    bytes32[] memory bobTanksInPod = TanksInPod.get(bobPodEntity);
    world.graduate();
    world.acceptOrder(order);
    vm.expectRevert("max players reached");
    world.shipTank(bobTanksInPod[1]);
    vm.stopPrank();
  }

  function testRevertPlayerInTutorial() public {
    setUp();

    prankAdmin();
    // Create order
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BLOOD_MEAL, 1000, 0, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    vm.expectRevert("not tutorial order");
    world.acceptOrder(orderEntity);

    vm.stopPrank();
  }

  function testAcceptAndUnacceptOrder() public {
    setUp();

    // Create order
    prankAdmin();
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    startGasReport("Accept order");
    world.acceptOrder(orderEntity);
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), orderEntity);

    startGasReport("Unaccept order");
    world.unacceptOrder();
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), bytes32(0));

    vm.stopPrank();
  }

  function testShip() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BLOOD, 2000, 1000, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    world.graduate();

    world.acceptOrder(orderEntity);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    uint blocksToWait = 100;

    vm.roll(block.number + blocksToWait);

    // Detach tank and resolve
    world.unplugTank(fixedEntities.outlet);

    startGasReport("Ship");
    world.shipTank(tanksInPod[1]);
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), bytes32(0));
    assertEq(Completed.get(orderEntity)[0], playerEntity);
    assertEq(Completed.get(playerEntity)[0], orderEntity);

    vm.stopPrank();
  }

  function testRevertShipOrderExpired() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    world.acceptOrder(orderEntity);

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.shipTank(tanksInPod[1]);

    vm.stopPrank();
  }

  function testRevertAcceptOrderExpired() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    vm.roll(block.number + ONE_MINUTE + 1);

    vm.expectRevert("order expired");
    world.acceptOrder(orderEntity);

    vm.stopPrank();
  }

  function testRevertOrderAlreadyCompleted() public {
    setUp();

    prankAdmin();
    bytes32 orderEntity = world.createOrder("", PublicMaterials.BUG, 1000, 0, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    world.acceptOrder(orderEntity);

    world.shipTank(tanksInPod[0]);

    vm.expectRevert("order already completed");
    world.acceptOrder(orderEntity);

    vm.stopPrank();
  }
}
