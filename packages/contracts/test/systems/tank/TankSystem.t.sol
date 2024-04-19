// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { NUMBER_OF_TANKS } from "../../../src/constants.sol";

contract TankSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] tanksInPod;
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

    fixedEntities = FixedEntities.get(podEntity);

    tanksInPod = TanksInPod.get(podEntity);

    vm.stopPrank();
  }

  function testattachTank() public {
    setUp();

    vm.startPrank(alice);

    assertEq(tanksInPod.length, NUMBER_OF_TANKS);

    startGasReport("Plug in tank");
    // Attach tank 0 to inlet 0
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);
    endGasReport();

    // Inlet 0 is connected to the tank 0
    assertEq(TankConnection.get(inletEntities[0]), tanksInPod[0]);

    // Tank 0 is connected to inlet 0
    assertEq(TankConnection.get(tanksInPod[0]), inletEntities[0]);

    vm.stopPrank();
  }

  function testDetachTank() public {
    setUp();

    vm.startPrank(alice);

    // Attach tank 0 to inlet 0
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Inlet is connected to the first tank
    assertEq(TankConnection.get(inletEntities[0]), tanksInPod[0]);

    // The first tank is connected to the inlet
    assertEq(TankConnection.get(tanksInPod[0]), inletEntities[0]);

    startGasReport("Unplug tank");
    // Detach tank 0
    world.unplugTank(tanksInPod[0]);
    endGasReport();

    // Inlet tank is disconnected
    assertEq(TankConnection.get(inletEntities[0]), bytes32(0));

    // The first tank is disconnected
    assertEq(TankConnection.get(tanksInPod[0]), bytes32(0));

    vm.stopPrank();
  }

  function testRevertTankAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    // Attach tank 0 to inlet 0
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);
    vm.expectRevert("tank already connected");
    // Attach tank 0 to inlet 1
    world.plugTank(tanksInPod[0], fixedEntities.inlets[1]);

    vm.stopPrank();
  }

  function testRevertTargetAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    // Attach tank 0 to inlet 0
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);
    vm.expectRevert("target already connected");
    // Attach tank 1 to inlet 0
    world.plugTank(tanksInPod[1], fixedEntities.inlets[0]);

    vm.stopPrank();
  }

  function testEmptyTank() public {
    setUp();

    vm.startPrank(alice);

    startGasReport("Empty tank");
    world.emptyTank(tanksInPod[0]);
    endGasReport();

    vm.stopPrank();
  }
}
