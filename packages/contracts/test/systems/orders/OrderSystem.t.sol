// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_MINUTE, ONE_HOUR, ONE_UNIT } from "../../../src/constants.sol";

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

    vm.stopPrank();

    // Set pod variables for this player
    usePlayerEntity(alice);
  }

  function spawnBob() internal {
    vm.startPrank(bob);

    // Spawn player
    playerEntity = world.spawn("bob");
    world.start();

    vm.stopPrank();

    // Set pod variables for this player
    usePlayerEntity(bob);
  }

  function usePlayerEntity(address _playerAddress) internal {
    playerEntity = LibUtils.addressToEntityKey(_playerAddress);

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    tanksInPod = TanksInPod.get(podEntity);

    fixedEntities = FixedEntities.get(podEntity);
  }

  function testCreateOrderAsAdmin() public {
    prankAdmin();
    // Create order
    startGasReport("Create order as admin");
    world.createOrder(PublicMaterials.BLOOD_MEAL, 100, 100, ONE_HOUR, 10);
    endGasReport();

    vm.stopPrank();
  }

  function testCreateOrderAsUser() public {
    /*//////////////////////////////////////////////////////////////
                         BOB CREATES ORDER
    //////////////////////////////////////////////////////////////*/
    spawnBob();
    vm.startPrank(bob);

    // Get bug tokens
    world.reward();

    // Create order
    startGasReport("Create order as user");
    bytes32 testOrder = world.createOrder(PublicMaterials.PISS, 50, 50, ONE_HOUR, 1);
    endGasReport();

    OrderData memory orderData = Order.get(testOrder);

    assertEq(orderData.creator, bob);

    vm.stopPrank();

    /*//////////////////////////////////////////////////////////////
                        ALICE FULLFILLS ORDER
    //////////////////////////////////////////////////////////////*/

    usePlayerEntity(alice);
    vm.startPrank(alice);

    world.graduate();

    // Accept test order
    world.acceptOrder(testOrder);

    world.fillTank(tanksInPod[0], 100, PublicMaterials.BUG);

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
    startGasReport("Ship (user created order)");
    world.shipTank(tanksInPod[1]);
    endGasReport();

    vm.stopPrank();

    // Alice got 10000 BUG tokens for graduating + 50 BUG tokens for completing the order
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 10050 * ONE_UNIT);
    // Bob got 50 PISS tokens for creating the order
    assertEq(PublicMaterials.PISS.getTokenBalance(bob), 50 * ONE_UNIT);
  }

  function testRevertCreateOrderInsufficientFunds() public {
    vm.startPrank(alice);

    // Create order
    vm.expectRevert("insufficient funds");
    world.createOrder(PublicMaterials.BLOOD_MEAL, 100000, 1000, ONE_HOUR, 10);

    vm.stopPrank();
  }

  function testRevertMaxPlayersReached() public {
    // Create order
    prankAdmin();
    bytes32 order = world.createOrder(PublicMaterials.BLOOD_MEAL, 0, 100, ONE_HOUR, 1);
    ContainedMaterial.set(tanksInPod[1], PublicMaterials.BLOOD_MEAL);
    vm.stopPrank();

    vm.startPrank(alice);
    world.graduate();
    world.acceptOrder(order);
    world.shipTank(tanksInPod[1]);
    vm.stopPrank();

    vm.startPrank(bob);
    // Spawn player
    world.spawn("bob");
    world.start();
    world.graduate();
    vm.expectRevert("max players reached");
    world.acceptOrder(order);
    vm.stopPrank();
  }

  function testRevertPlayerInTutorial() public {
    prankAdmin();
    // Create order
    bytes32 orderEntity = world.createOrder(PublicMaterials.BLOOD_MEAL, 100, 100, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    vm.expectRevert("not tutorial order");
    world.acceptOrder(orderEntity);

    vm.stopPrank();
  }

  function testAcceptAndUnacceptOrder() public {
    // Create order
    prankAdmin();
    bytes32 orderEntity = world.createOrder(PublicMaterials.BLOOD_MEAL, 100, 100, ONE_HOUR, 10);
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
    prankAdmin();
    bytes32 orderEntity = world.createOrder(PublicMaterials.BLOOD, 20, 100, ONE_HOUR, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    world.graduate();

    world.acceptOrder(orderEntity);

    world.fillTank(tanksInPod[0], 100, PublicMaterials.BUG);

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

    startGasReport("Ship (admin created order)");
    world.shipTank(tanksInPod[1]);
    endGasReport();

    assertEq(CurrentOrder.get(playerEntity), bytes32(0));
    assertEq(Completed.get(orderEntity)[0], playerEntity);
    assertEq(Completed.get(playerEntity)[0], orderEntity);
    assertEq(PublicMaterials.BUG.getTokenBalance(alice), 10100 * ONE_UNIT); // 10000 tokens given for graduating
    assertEq(PublicMaterials.BUG.getTokenBalance(worldAddress), 0);

    vm.stopPrank();
  }

  function testRevertShipOrderExpired() public {
    prankAdmin();
    bytes32 orderEntity = world.createOrder(PublicMaterials.BUG, 100, 100, ONE_MINUTE, 10);
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
    prankAdmin();
    bytes32 orderEntity = world.createOrder(PublicMaterials.BUG, 100, 100, ONE_MINUTE, 10);
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
    prankAdmin();
    bytes32 orderEntity = world.createOrder(PublicMaterials.BUG, 100, 100, ONE_MINUTE, 10);
    vm.stopPrank();

    vm.startPrank(alice);

    // Fast forward out of tutorial
    world.graduate();

    world.fillTank(tanksInPod[0], 100, PublicMaterials.BUG);

    world.acceptOrder(orderEntity);

    world.shipTank(tanksInPod[0]);

    vm.expectRevert("order already completed");
    world.acceptOrder(orderEntity);

    vm.stopPrank();
  }
}
