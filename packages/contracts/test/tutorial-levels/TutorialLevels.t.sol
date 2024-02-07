// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../BaseTest.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract TutorialLevelsTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
  bytes32[] tutorialLevels;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    depotsInPod = DepotsInPod.get(podEntity);

    tutorialLevels = TutorialOrders.get();

    vm.stopPrank();
  }

  function testLevelOne() public {
    setUp();

    vm.startPrank(alice);

    // Set up level
    OrderData memory currentOrderData = Order.get(tutorialLevels[0]);
    OrderData memory nextOrderData = Order.get(tutorialLevels[1]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    // Wait 4 blocks
    vm.roll(block.number + 4);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // Check depot 0
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 4 * 100 = 400
    assertEq(Amount.get(depotsInPod[0]), 1600); // 2000 400 = 0

    // Check depot 1
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.BLOOD));
    // Outlet material gained => 4 * 50 = 200
    assertEq(Amount.get(depotsInPod[1]), 200); // 0 + 200 = 200

    // Fill the order
    world.fill(depotsInPod[1]);

    // Order is set to next tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[1]);

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Depot 0 should be filled with next order's material
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(nextOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), nextOrderData.resourceAmount);

    vm.stopPrank();
  }

  function testLevelTwo() public {
    setUp();

    vm.startPrank(alice);

    // Set up level
    world.warp(1);
    OrderData memory currentOrderData = Order.get(tutorialLevels[1]);
    OrderData memory nextOrderData = Order.get(tutorialLevels[2]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // Check depot 0
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 10 * 100 = 1000
    assertEq(Amount.get(depotsInPod[0]), 1000); // 1000 1000 = 0

    // Check depot 1
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.PISS));
    // Outlet material gained => 10 * 50 = 500
    assertEq(Amount.get(depotsInPod[1]), 500); // 0 + 500 = 500

    // Fill the order
    world.fill(depotsInPod[1]);

    // Order is set to next tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[2]);

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Depot 0 should be filled with next order's material
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(nextOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), nextOrderData.resourceAmount);

    vm.stopPrank();
  }

  function testLevelThree() public {
    setUp();

    vm.startPrank(alice);

    // Set up level
    world.warp(2);
    OrderData memory currentOrderData = Order.get(tutorialLevels[2]);
    OrderData memory nextOrderData = Order.get(tutorialLevels[3]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Build boiler
    bytes32 boilerOne = world.build(MACHINE_TYPE.BOILER);

    // Connect player (piss) to boiler
    world.connect(playerEntity, boilerOne, PORT_INDEX.FIRST);

    // Connect boiler to outlet
    world.connect(boilerOne, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // Check depot 0
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 10 * 100 = 1000
    assertEq(Amount.get(depotsInPod[0]), 1000); // 1000 1000 = 0

    // Check depot 1
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NESTLE_PURE_LIFE_BOTTLED_WATER));
    // Outlet material gained => 10 * 50 = 500
    assertEq(Amount.get(depotsInPod[1]), 500); // 0 + 500 = 500

    // Fill the order
    world.fill(depotsInPod[1]);

    // Order is set to next tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[3]);

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Depot 0 should be filled with next order's material
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(nextOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), nextOrderData.resourceAmount);

    vm.stopPrank();
  }

  function testLevelFour() public {
    setUp();

    vm.startPrank(alice);

    // Set up level
    world.warp(3);
    OrderData memory currentOrderData = Order.get(tutorialLevels[3]);
    OrderData memory nextOrderData = Order.get(tutorialLevels[4]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Build boiler
    bytes32 boilerOne = world.build(MACHINE_TYPE.BOILER);

    // Build dryer
    bytes32 dryerOne = world.build(MACHINE_TYPE.DRYER);

    // Connect inlet to boiler
    world.connect(inletEntities[0], boilerOne, PORT_INDEX.FIRST);

    // Connect boiler to dryer
    world.connect(boilerOne, dryerOne, PORT_INDEX.FIRST);

    // Connect dryer to outlet
    world.connect(dryerOne, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // Check depot 0
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.BUG));
    // Inlet material spent => 10 * 100 = 1000
    assertEq(Amount.get(depotsInPod[0]), 1000); // 1000 1000 = 0

    // Check depot 1
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.PURE_FAT));
    // Outlet material gained => 10 * 100 = 1000
    assertEq(Amount.get(depotsInPod[1]), 1000); // 0 + 1000 = 1000

    // Fill the order
    world.fill(depotsInPod[1]);

    // Order is set to next tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[4]);

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Depot 0 should be filled with next order's material
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(nextOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), nextOrderData.resourceAmount);

    vm.stopPrank();
  }

  function testLevelFive() public {
    setUp();

    vm.startPrank(alice);

    // Set up level
    world.warp(4);
    OrderData memory currentOrderData = Order.get(tutorialLevels[4]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.OUTLET);

    // Build Splitter
    bytes32 splitter = world.build(MACHINE_TYPE.SPLITTER);

    // Build boiler
    bytes32 boiler = world.build(MACHINE_TYPE.BOILER);

    // Build dryer one
    bytes32 dryerOne = world.build(MACHINE_TYPE.DRYER);

    // Build dryer two
    bytes32 dryerTwo = world.build(MACHINE_TYPE.DRYER);

    // Build mixer
    bytes32 mixer = world.build(MACHINE_TYPE.MIXER);

    // Connect inlet to Splitter
    world.connect(inletEntities[0], splitter, PORT_INDEX.FIRST);

    // Connect splitter to player
    world.connect(splitter, playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to dryer one
    world.connect(playerEntity, dryerOne, PORT_INDEX.FIRST);

    // Connect dryer one to mixer
    world.connect(dryerOne, mixer, PORT_INDEX.FIRST);

    // Connect splitter to boiler
    world.connect(splitter, boiler, PORT_INDEX.SECOND);

    // Connect boiler to dryer two
    world.connect(boiler, dryerTwo, PORT_INDEX.FIRST);

    // Connect dryer two to mixer
    world.connect(dryerTwo, mixer, PORT_INDEX.FIRST);

    // Connect mixer to outlet
    world.connect(mixer, outletEntity, PORT_INDEX.FIRST);

    // Wait 20 blocks
    vm.roll(block.number + 20);

    // Disconnect depot and resolve
    world.detachDepot(MACHINE_TYPE.OUTLET);

    // Check depot 0
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(MATERIAL_TYPE.NONE));
    // Inlet material spent => 20 * 100 = 2000
    assertEq(Amount.get(depotsInPod[0]), 0); // 2000 - 2000 = 0

    // Check depot 1
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.AESOP_ORGANIC_HAND_SOAP));
    // Outlet material gained => 20 * 75 = 1500
    assertEq(Amount.get(depotsInPod[1]), 1000); // Capped by input material

    // Fill the order
    world.fill(depotsInPod[1]);

    // Tutorial is done
    assertEq(Tutorial.get(playerEntity), false);

    // Order is unset
    assertEq(CurrentOrder.get(podEntity), bytes32(0));

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    vm.stopPrank();
  }
}
