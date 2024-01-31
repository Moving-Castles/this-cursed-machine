// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";

contract ResolveSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32 inletEntity;
  bytes32 outletEntity;
  bytes32[] storageInPod;
  bytes32 dispenserEntity;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntity = FixedEntities.get(podEntity).inlet;
    outletEntity = FixedEntities.get(podEntity).outlet;

    storageInPod = StorageInPod.get(podEntity);

    dispenserEntity = FixedEntities.get(podEntity).dispenser;

    vm.stopPrank();
  }

  function testResolve() public {
    setUp();

    vm.startPrank(alice);

    // Connect dispenser to inlet
    world.connectStorage(dispenserEntity, MACHINE_TYPE.INLET);

    // Connect storage 1 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to outlet
    world.connect(inletEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 5 blocks
    vm.roll(block.number + 3);

    // Resolve
    world.resolve();

    vm.stopPrank();

    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.BUG));

    // 3 blocks passed
    // Inlet material spent => 3 * 100 = 300
    // Outlet material gained => 3 * 100 = 300
    assertEq(Amount.get(storageInPod[1]), 300);
    assertEq(Amount.get(dispenserEntity), 700); // 1000 - 300
  }

  function testMachineProcessingLoss() public {
    setUp();

    vm.startPrank(alice);

    // Connect dispenser to inlet
    world.connectStorage(dispenserEntity, MACHINE_TYPE.INLET);

    // Connect storage 1 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect player to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 5 blocks
    vm.roll(block.number + 3);

    // Resolve
    world.resolve();

    vm.stopPrank();

    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.PISS));

    // 3 blocks passed
    // Inlet material spent => 3 * 100 = 300
    // Outlet material gained => 3 * 50 = 150
    assertEq(Amount.get(storageInPod[1]), 150);
    assertEq(Amount.get(dispenserEntity), 700); // 1000 - 300
  }

  function testDoubleMachineProcessingLoss() public {
    setUp();

    vm.startPrank(alice);

    // Connect dispenser to inlet
    world.connectStorage(dispenserEntity, MACHINE_TYPE.INLET);

    // Connect storage 2 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Build splitter
    bytes32 splitterEntity = world.build(MACHINE_TYPE.SPLITTER);

    // Connect player to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to outlet
    world.connect(splitterEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 5 blocks
    vm.roll(block.number + 3);

    // Resolve
    world.resolve();

    vm.stopPrank();

    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.PISS));

    // 3 blocks passed
    // Inlet material spent => 3 * 100 = 300
    // Outlet material gained => 3 * 25 = 75
    assertEq(Amount.get(storageInPod[1]), 75);
    assertEq(Amount.get(dispenserEntity), 700); // 1000 - 300
  }

  function testCapAtInletMaterialAmount() public {
    setUp();

    vm.startPrank(alice);

    // Connect dispenser to inlet
    world.connectStorage(dispenserEntity, MACHINE_TYPE.INLET);

    // Connect storage 2 to outlet
    world.connectStorage(storageInPod[1], MACHINE_TYPE.OUTLET);

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect inlet to player
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 50 blocks
    vm.roll(block.number + 50);

    // Resolve
    world.resolve();

    vm.stopPrank();

    assertEq(uint32(MaterialType.get(storageInPod[1])), uint32(MATERIAL_TYPE.PISS));

    // 50 blocks passed
    assertEq(Amount.get(storageInPod[1]), 500); // 500
    assertEq(Amount.get(dispenserEntity), 0); // 1000 - 1000

    assertEq(uint32(MaterialType.get(storageInPod[0])), uint32(MATERIAL_TYPE.NONE));
  }
}
