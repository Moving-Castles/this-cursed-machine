// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { NUMBER_OF_DEPOTS } from "../../../src/constants.sol";

contract DepotSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
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

    depotsInPod = DepotsInPod.get(podEntity);

    vm.stopPrank();
  }

  function testattachDepot() public {
    setUp();

    vm.startPrank(alice);

    assertEq(depotsInPod.length, NUMBER_OF_DEPOTS);

    startGasReport("Attach depot");
    // Attach depot 0 to inlet 0
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);
    endGasReport();

    // Inlet 0 is connected to the depot 0
    assertEq(DepotConnection.get(inletEntities[0]), depotsInPod[0]);

    // Depot 0 is connected to inlet 0
    assertEq(DepotConnection.get(depotsInPod[0]), inletEntities[0]);

    vm.stopPrank();
  }

  function testDetachDepot() public {
    setUp();

    vm.startPrank(alice);

    // Attach depot 0 to inlet 0
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);

    // Inlet is connected to the first depot
    assertEq(DepotConnection.get(inletEntities[0]), depotsInPod[0]);

    // The first depot is connected to the inlet
    assertEq(DepotConnection.get(depotsInPod[0]), inletEntities[0]);

    startGasReport("Detach depot");
    // Detach depot 0
    world.detachDepot(depotsInPod[0]);
    endGasReport();

    // Inlet depot is disconnected
    assertEq(DepotConnection.get(inletEntities[0]), bytes32(0));

    // The first depot is disconnected
    assertEq(DepotConnection.get(depotsInPod[0]), bytes32(0));

    vm.stopPrank();
  }

  function testRevertDepotAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    // Attach depot 0 to inlet 0
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);
    vm.expectRevert("depot already connected");
    // Attach depot 0 to inlet 1
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[1]);

    vm.stopPrank();
  }

  function testRevertTargetAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    // Attach depot 0 to inlet 0
    world.attachDepot(depotsInPod[0], fixedEntities.inlets[0]);
    vm.expectRevert("target already connected");
    // Attach depot 1 to inlet 0
    world.attachDepot(depotsInPod[1], fixedEntities.inlets[0]);

    vm.stopPrank();
  }

  function testEmptyDepot() public {
    setUp();

    vm.startPrank(alice);

    startGasReport("Clear depot");
    world.emptyDepot(depotsInPod[0]);
    endGasReport();

    vm.stopPrank();
  }
}
