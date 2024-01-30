// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract StorageSystemTest is BaseTest {
  function testConnectStorage() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    assertEq(storageInPod.length, 3);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first storage
    assertEq(StorageConnection.get(InletEntity.get(podEntity)), storageInPod[0]);

    // The first storage is connected to the inlet
    assertEq(StorageConnection.get(storageInPod[0]), InletEntity.get(podEntity));

    vm.stopPrank();
  }

  function testDisconnectStorage() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);

    // Inlet is connected to the first storage
    assertEq(StorageConnection.get(InletEntity.get(podEntity)), storageInPod[0]);

    // The first storage is connected to the inlet
    assertEq(StorageConnection.get(storageInPod[0]), InletEntity.get(podEntity));

    world.disconnectStorage(MACHINE_TYPE.INLET);

    // Inlet storage is disconnected
    assertEq(StorageConnection.get(InletEntity.get(podEntity)), bytes32(0));

    // The first storage is disconnected
    assertEq(StorageConnection.get(storageInPod[0]), bytes32(0));

    vm.stopPrank();
  }

  function testRevertTargetAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("target already connected");
    world.connectStorage(storageInPod[1], MACHINE_TYPE.INLET);

    vm.stopPrank();
  }

  function testRevertStorageAlreayConnected() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    world.connectStorage(storageInPod[0], MACHINE_TYPE.INLET);
    vm.expectRevert("storage already connected");
    world.connectStorage(storageInPod[0], MACHINE_TYPE.OUTLET);

    vm.stopPrank();
  }

  function testClearStorage() public {
    setUp();

    vm.startPrank(alice);

    bytes32 playerEntity = world.spawn();
    world.start();

    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory storageInPod = StorageInPod.get(podEntity);

    world.clearStorage(storageInPod[0]);

    vm.stopPrank();
  }
}
