// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../BaseTest.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";
import { FLOW_RATE } from "../../src/constants.sol";

contract TutorialLevelsTest is BaseTest {
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

  function calculateBlocksToWait(uint flowRate, uint divisor, uint goalAmount) internal pure returns (uint) {
    // Calculate the effective output per block considering the divisor
    uint effectiveOutputPerBlock = flowRate / divisor;

    // Calculate the total number of blocks needed to reach the goal amount
    uint blocksNeeded = goalAmount / effectiveOutputPerBlock;

    return blocksNeeded;
  }

  function expectedInletdAmount(
    uint initialResourceAmount,
    uint blocksWaited,
    uint flowRate
  ) internal pure returns (uint) {
    // Calculate the total amount of material processed after waiting for the given blocks
    uint totalProcessed = blocksWaited * flowRate;

    // Calculate the remaining amount of material after processing
    uint remainingAmount = initialResourceAmount > totalProcessed ? initialResourceAmount - totalProcessed : 0;

    return remainingAmount;
  }

  function checkProcessing(OrderData memory currentOrderData, uint blocksToWait) internal {
    uint inletAmount = expectedInletdAmount(currentOrderData.resourceAmount, blocksToWait, FLOW_RATE);

    // Check inlet amount and type after processing
    assertEq(
      uint32(MaterialType.get(depotsInPod[0])),
      inletAmount == 0 ? uint32(MATERIAL_TYPE.NONE) : uint32(currentOrderData.resourceMaterialType)
    );
    assertEq(Amount.get(depotsInPod[0]), inletAmount);

    // Check outlet amount and type after processing
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(currentOrderData.goalMaterialType));
    assertEq(Amount.get(depotsInPod[1]), currentOrderData.goalAmount);
  }

  function shipAndCheckProgression(uint32 levelIndex, OrderData memory nextOrderData, uint256 leftOver) internal {
    vm.startPrank(alice);

    // Fill the order and perform final checks
    world.ship(depotsInPod[1]);

    // Order is set to next tutorial order
    assertEq(CurrentOrder.get(podEntity), tutorialLevels[levelIndex + 1]);

    // Depot 1 should be empty
    assertEq(uint32(MaterialType.get(depotsInPod[1])), uint32(MATERIAL_TYPE.NONE));
    assertEq(Amount.get(depotsInPod[1]), 0);

    // Depot 0 should be filled with next order's material + left over from previous order
    assertEq(uint32(MaterialType.get(depotsInPod[0])), uint32(nextOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), nextOrderData.resourceAmount + leftOver);

    vm.stopPrank();
  }

  function setupLevel(
    uint32 levelIndex
  ) internal returns (OrderData memory currentOrderData, OrderData memory nextOrderData) {
    if (levelIndex > 0) {
      vm.startPrank(alice);
      world.warp(levelIndex);
      vm.stopPrank();
    }

    // Get order data for the current and next level
    currentOrderData = Order.get(tutorialLevels[levelIndex]);
    nextOrderData = Order.get(tutorialLevels[levelIndex + 1]);

    // Check that the inlet depot has the correct type and amount of material
    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    return (currentOrderData, nextOrderData);
  }

  function testLevelOne() public {
    setUp();

    uint32 levelIndex = 0;

    (OrderData memory currentOrderData, OrderData memory nextOrderData) = setupLevel(levelIndex);

    /*
     * + + + + + + + + + + + + +
     * START: Build the machine
     * + + + + + + + + + + + + +
     */

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    uint divisor = 2; // Material loss
    uint blocksToWait = calculateBlocksToWait(FLOW_RATE, divisor, currentOrderData.goalAmount);

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    vm.stopPrank();

    /*
     * + + + + + + + + + + + +
     * END: Build the machine
     * + + + + + + + + + + + +
     */

    checkProcessing(currentOrderData, blocksToWait);
    shipAndCheckProgression(levelIndex, nextOrderData, currentOrderData.resourceAmount - blocksToWait * FLOW_RATE);
  }

  function testLevelTwo() public {
    setUp();

    uint32 levelIndex = 1;

    (OrderData memory currentOrderData, OrderData memory nextOrderData) = setupLevel(levelIndex);

    /*
     * + + + + + + + + + + + + +
     * START: Build the machine
     * + + + + + + + + + + + + +
     */

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    uint divisor = 2;
    uint blocksToWait = calculateBlocksToWait(FLOW_RATE, divisor, currentOrderData.goalAmount);

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    vm.stopPrank();

    /*
     * + + + + + + + + + + + +
     * END: Build the machine
     * + + + + + + + + + + + +
     */

    checkProcessing(currentOrderData, blocksToWait);
    shipAndCheckProgression(levelIndex, nextOrderData, currentOrderData.resourceAmount - blocksToWait * FLOW_RATE);
  }

  function testLevelThree() public {
    setUp();

    uint32 levelIndex = 2;

    (OrderData memory currentOrderData, OrderData memory nextOrderData) = setupLevel(levelIndex);

    /*
     * + + + + + + + + + + + + +
     * START: Build the machine
     * + + + + + + + + + + + + +
     */

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Build boiler
    bytes32 boilerOne = world.build(MACHINE_TYPE.BOILER);

    // Connect player (piss) to boiler
    world.connect(playerEntity, boilerOne, PORT_INDEX.FIRST);

    // Connect boiler to outlet
    world.connect(boilerOne, outletEntity, PORT_INDEX.FIRST);

    uint divisor = 2; // Material loss
    uint blocksToWait = calculateBlocksToWait(FLOW_RATE, divisor, currentOrderData.goalAmount);

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    vm.stopPrank();

    /*
     * + + + + + + + + + + + +
     * END: Build the machine
     * + + + + + + + + + + + +
     */

    checkProcessing(currentOrderData, blocksToWait);
    shipAndCheckProgression(levelIndex, nextOrderData, currentOrderData.resourceAmount - blocksToWait * FLOW_RATE);
  }

  function testLevelFour() public {
    setUp();

    uint32 levelIndex = 3;

    (OrderData memory currentOrderData, OrderData memory nextOrderData) = setupLevel(levelIndex);

    /*
     * + + + + + + + + + + + + +
     * START: Build the machine
     * + + + + + + + + + + + + +
     */

    vm.startPrank(alice);

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

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

    uint divisor = 1; // Material loss
    uint blocksToWait = calculateBlocksToWait(FLOW_RATE, divisor, currentOrderData.goalAmount);

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    vm.stopPrank();

    /*
     * + + + + + + + + + + + +
     * END: Build the machine
     * + + + + + + + + + + + +
     */

    checkProcessing(currentOrderData, blocksToWait);
    shipAndCheckProgression(levelIndex, nextOrderData, currentOrderData.resourceAmount - blocksToWait * FLOW_RATE);
  }

  function testLevelFive() public {
    setUp();

    uint32 levelIndex = 4;

    vm.startPrank(alice);

    // Set up level
    world.warp(levelIndex);
    OrderData memory currentOrderData = Order.get(tutorialLevels[4]);

    assertEq(uint(MaterialType.get(depotsInPod[0])), uint(currentOrderData.resourceMaterialType));
    assertEq(Amount.get(depotsInPod[0]), currentOrderData.resourceAmount);

    /*
     * + + + + + + + + + + + + +
     * START: Build the machine
     * + + + + + + + + + + + + +
     */

    // Connect depot 0 to inlet
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Connect depot 1 to outlet
    world.attachDepot(depotsInPod[1], fixedEntities.outlet);

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

    uint divisor = 4; // Material loss
    uint blocksToWait = calculateBlocksToWait(FLOW_RATE, divisor, currentOrderData.goalAmount);

    vm.roll(block.number + blocksToWait);

    // Detach depot and resolve
    world.detachDepot(fixedEntities.outlet);

    /*
     * + + + + + + + + + + + +
     * END: Build the machine
     * + + + + + + + + + + + +
     */

    checkProcessing(currentOrderData, blocksToWait);

    // Fill the order
    world.ship(depotsInPod[1]);

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
