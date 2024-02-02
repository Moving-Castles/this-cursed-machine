// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract StorageSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] storageInPod;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    storageInPod = StorageInPod.get(podEntity);

    vm.stopPrank();
  }

  function testConnectStorage() public {
    setUp();

    vm.startPrank(alice);

    assertEq(storageInPod.length, 6);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first storage
    assertEq(StorageConnection.get(inletEntities[0]), storageInPod[0]);

    // The first storage is connected to the inlet
    assertEq(StorageConnection.get(storageInPod[0]), inletEntities[0]);

    vm.stopPrank();
  }

  function testDisconnectStorage() public {
    setUp();

    vm.startPrank(alice);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first storage
    assertEq(StorageConnection.get(inletEntities[0]), storageInPod[0]);

    // The first storage is connected to the inlet
    assertEq(StorageConnection.get(storageInPod[0]), inletEntities[0]);

    world.disconnectStorage(MACHINE_TYPE.INLET);

    // Inlet storage is disconnected
    assertEq(StorageConnection.get(inletEntities[0]), bytes32(0));

    // The first storage is disconnected
    assertEq(StorageConnection.get(storageInPod[0]), bytes32(0));

    vm.stopPrank();
  }

  function testRevertTargetAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("target already connected");
    world.connectStorage(storageInPod[1], MACHINE_TYPE.INLET);

    vm.stopPrank();
  }

  function testRevertStorageAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("storage already connected");
    world.connectStorage(storageInPod[0], MACHINE_TYPE.OUTLET);

    vm.stopPrank();
  }

  function testClearStorage() public {
    setUp();

    vm.startPrank(alice);

    world.clearStorage(storageInPod[0]);

    vm.stopPrank();
  }
}
