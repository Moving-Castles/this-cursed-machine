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

    vm.stopPrank();
  }

  function testattachDepot() public {
    setUp();

    vm.startPrank(alice);

    assertEq(depotsInPod.length, NUMBER_OF_DEPOTS);

    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first depot
    assertEq(DepotConnection.get(inletEntities[0]), depotsInPod[0]);

    // The first depot is connected to the inlet
    assertEq(DepotConnection.get(depotsInPod[0]), inletEntities[0]);

    vm.stopPrank();
  }

  function testDetachDepot() public {
    setUp();

    vm.startPrank(alice);

    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first depot
    assertEq(DepotConnection.get(inletEntities[0]), depotsInPod[0]);

    // The first depot is connected to the inlet
    assertEq(DepotConnection.get(depotsInPod[0]), inletEntities[0]);

    world.detachDepot(MACHINE_TYPE.INLET);

    // Inlet depot is disconnected
    assertEq(DepotConnection.get(inletEntities[0]), bytes32(0));

    // The first depot is disconnected
    assertEq(DepotConnection.get(depotsInPod[0]), bytes32(0));

    vm.stopPrank();
  }

  function testRevertTargetAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("target already connected");
    world.attachDepot(depotsInPod[1], MACHINE_TYPE.INLET);

    vm.stopPrank();
  }

  function testRevertDepotAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    world.attachDepot(depotsInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("depot already connected");
    world.attachDepot(depotsInPod[0], MACHINE_TYPE.OUTLET);

    vm.stopPrank();
  }

  function testClearDepot() public {
    setUp();

    vm.startPrank(alice);

    world.clearDepot(depotsInPod[0]);

    vm.stopPrank();
  }
}
