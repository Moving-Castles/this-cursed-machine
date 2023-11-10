// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract TransferSystemTest is MudTest {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get();
    alice = address(111);
    bob = address(222);
  }

  function testTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.restart();
    vm.stopPrank();

    assertEq(Level.get(coreEntity), 1);
  }

  //  function testMoveProductsToWarehouse() public {
  //   setUp();

  //   vm.startPrank(alice);

  //   // Spawn core
  //   bytes32 coreEntity = world.spawn();
  //   world.restart();

  //   // Get inlet entity
  //   bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.INLET);
  //   bytes32 inletEntity = inletEntities[0][0];

  //   // Get outlet entity
  //   bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.OUTLET);
  //   bytes32 outletEntity = outletEntities[0][0];

  //   // Connect inlet to core
  //   world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);

  //   // Connect core (piss port) to outlet
  //   world.connect(coreEntity, outletEntity, PORT_INDEX.FIRST);

  //   // Wait 10 blocks
  //   vm.roll(block.number + 10);

  //   // Resolve
  //   world.resolve();

  //   vm.stopPrank();

  //   // Get materials
  //   bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

  //   // Log materials
  //   logMaterials(materials);

  //   // Product should be 500 piss
  //   assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.PISS));
  //   assertEq(Amount.get(materials[0][0]), 500);
  // }

  function testDisconnectOutletOnTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    assertEq(IncomingConnections.get(outletEntity).length, 1);

    // Connect core to outlet
    world.connect(coreEntity, outletEntity, PORT_INDEX.FIRST);

    // Connect inlet to core
    world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Transfer
    world.transfer();

    assertEq(Level.get(coreEntity), 2);

    // Check that the outlet is disconnected
    bytes32[] memory outletIncomingConnections = IncomingConnections.get(outletEntity);
    assertEq(outletIncomingConnections.length, 1);
    assertEq(outletIncomingConnections[0], bytes32(0));

    // Check that the core is disconnected from the outlet
    bytes32[] memory coreOutgoingConnections = OutgoingConnections.get(coreEntity);
    assertEq(coreOutgoingConnections.length, 2);
    assertEq(coreOutgoingConnections[0], bytes32(0));

    vm.stopPrank();
  }
}
