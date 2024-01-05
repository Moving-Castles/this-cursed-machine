// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, MATERIAL_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract ResolveSystemTest is MudTest {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;

  function logMaterials(bytes32[][] memory _materials) internal view {
    for (uint i = 0; i < _materials.length; i++) {
      console.log("MaterialType");
      console.log(uint8(MaterialType.get(_materials[i][0])));
      console.log("Amount");
      console.log(Amount.get(_materials[i][0]));
      console.log("-------");
    }
  }

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get();
    alice = address(111);
    bob = address(222);
  }

  function testEnergyTickDown() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Energy should be 100 - 10 = 90
    assertEq(uint8(Energy.get(playerEntity)), 90);
  }

  function testBugsToEnergy() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Wait 100 blocks
    vm.roll(block.number + 40);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Starting energy: 100
    // Connection cost : 0
    // 40 blocks: 40 bugs => 40 energy
    // == 140 energy
    assertEq(uint8(Energy.get(playerEntity)), 140);
  }

  function testMakePiss() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss port) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByPod(CarriedBy.get(playerEntity));

    // Log materials
    logMaterials(materials);

    // Product should be 500 piss
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.PISS));
    assertEq(Amount.get(materials[0][0]), 500);
  }

  function testMakeBlood() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood port) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.SECOND);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByPod(CarriedBy.get(playerEntity));

    // Log materials
    logMaterials(materials);

    // Product should be 500 blood
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.BLOOD));
    assertEq(Amount.get(materials[0][0]), 500);
  }

  function testMakeSludge() public {
    setUp();

    vm.startPrank(alice);
    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    vm.roll(block.number + 100);

    world.resolve();

    // Build a dryer
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);

    // Connect player (piss port) to dryer
    world.connect(playerEntity, dryerEntity, PORT_INDEX.FIRST);

    // Connect dryer to outlet
    world.connect(dryerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // @todo Check outlet pool

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByPod(CarriedBy.get(playerEntity));

    // Log materials
    logMaterials(materials);

    // Product should be 500 sludge
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.SLUDGE));
    assertEq(Amount.get(materials[0][0]), 500);
  }

  function testMakeCaffeineSlushy() public {
    setUp();

    // 1. Spawn player
    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    // Connect inlet output to player input
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Build a mixer
    bytes32 mixerEntity = world.build(MACHINE_TYPE.MIXER);

    // Connect player (both ports) to mixer
    world.connect(playerEntity, mixerEntity, PORT_INDEX.SECOND);
    world.connect(playerEntity, mixerEntity, PORT_INDEX.FIRST);

    // Connect mixer to outlet
    world.connect(mixerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByPod(CarriedBy.get(playerEntity));

    // Log materials
    logMaterials(materials);

    // Product should be 500 caffeine slushy
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.CAFFEINE_SLUSHY));
    assertEq(Amount.get(materials[0][0]), 500);
  }

  function testMaterialConsolidation() public {
    setUp();

    vm.startPrank(alice);

    // Spawn player
    bytes32 playerEntity = world.spawn();
    world.restart();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.INLET);
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByPod(CarriedBy.get(playerEntity), MACHINE_TYPE.OUTLET);
    bytes32 outletEntity = outletEntities[0][0];

    // Connect inlet to player
    world.connect(inletEntity, playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss port) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByPod(CarriedBy.get(playerEntity));

    // Log materials
    logMaterials(materials);

    // Product should be 1000 piss
    assertEq(materials.length, 1);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.PISS));
    assertEq(Amount.get(materials[0][0]), 1000);
  }
}
