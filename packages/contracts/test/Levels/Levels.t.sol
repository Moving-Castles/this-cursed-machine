// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { console } from "forge-std/console.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { GasReporter } from "@latticexyz/gas-report/src/GasReporter.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, MATERIAL_TYPE, ENTITY_TYPE, PORT_INDEX } from "../../src/codegen/common.sol";

contract LevelsTest is MudTest, GasReporter {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;
  bytes32 coreEntity;
  bytes32 inletEntity;
  bytes32 outletEntity;

  function logMaterials(bytes32[][] memory _materials) internal view {
    // console.log("Material length");
    // console.log(_materials.length);
    // for (uint i = 0; i < _materials.length; i++) {
    //   console.log("MaterialType");
    //   console.log(uint8(MaterialType.get(_materials[i][0])));
    //   console.log("Amount");
    //   console.log(Amount.get(_materials[i][0]));
    //   console.log("-------");
    // }
  }

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get();
    alice = address(111);
    bob = address(222);

    vm.startPrank(alice);

    // * * * * * * * * * * * * * * * * * * *
    // PRE
    // * * * * * * * * * * * * * * * * * * *
    // Spawn core
    coreEntity = world.spawn();
    // Restart (to transfer to pod)
    world.restart();

    vm.stopPrank();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.INLET);
    inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibPod.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.OUTLET);
    outletEntity = outletEntities[0][0];
  }

  function testLevel1() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 1
    // _ GOALS:
    // - 101 core energy
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 1");

    // Connect inlet to core
    world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);
    // * Wait 1 block
    vm.roll(block.number + 1);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Assert: core energy == 101
    assertEq(uint8(Energy.get(coreEntity)), 101);
    // Nothing should be produced
    assertEq(materials.length, 0);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: core level == 2
    assertEq(Level.get(coreEntity), 2);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel2() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 2
    // _ GOALS:
    // - 1000 piss
    // - 1000 blood
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 2");

    // Warp to level
    world.warp(2);

    // Connect inlet to core
    world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);
    // Connect core piss port to outlet
    world.connect(coreEntity, outletEntity, PORT_INDEX.FIRST);
    // * Wait 11 blocks
    vm.roll(block.number + 20);
    // Disconnect piss connection
    world.disconnect(coreEntity, PORT_INDEX.FIRST);
    // Connect core blood port to outlet
    world.connect(coreEntity, outletEntity, PORT_INDEX.SECOND);
    // * Wait 11 blocks
    vm.roll(block.number + 20);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 1000 piss and 1000 blood
    assertEq(materials.length, 2);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.PISS));
    assertEq(Amount.get(materials[0][0]), 1000);
    assertEq(uint8(MaterialType.get(materials[1][0])), uint8(MATERIAL_TYPE.BLOOD));
    assertEq(Amount.get(materials[1][0]), 1000);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: level == 3
    assertEq(Level.get(coreEntity), 3);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel3() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 3
    // _ GOALS
    // - 1000 CAFFEIN SLUSHY
    // - 1000 CLUB MATE
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 3");

    // Warp to level
    world.warp(3);

    // Connect inlet to core
    world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);
    // Build mixer
    bytes32 mixerEntity = world.build(MACHINE_TYPE.MIXER);
    // Connect core piss port to mixer
    world.connect(coreEntity, mixerEntity, PORT_INDEX.FIRST);
    // Connect core blood port to mixer
    world.connect(coreEntity, mixerEntity, PORT_INDEX.SECOND);
    // Connect mixer to outlet
    world.connect(mixerEntity, outletEntity, PORT_INDEX.FIRST);
    // Wait 11 blocks
    vm.roll(block.number + 20);
    // Disconnect mixer connection
    world.disconnect(mixerEntity, PORT_INDEX.FIRST);
    // Build Cooler
    bytes32 coolerEntity = world.build(MACHINE_TYPE.COOLER);
    // Connect mixer to Cooler
    world.connect(mixerEntity, coolerEntity, PORT_INDEX.FIRST);
    // Connect Cooler to outlet
    world.connect(coolerEntity, outletEntity, PORT_INDEX.FIRST);
    // * Wait 11 blocks
    vm.roll(block.number + 20);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 100 CAFFEIN SLUSHY and 1000 CLUB MATE
    assertEq(materials.length, 2);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.CAFFEINE_SLUSHY));
    assertEq(Amount.get(materials[0][0]), 1000);
    assertEq(uint8(MaterialType.get(materials[1][0])), uint8(MATERIAL_TYPE.CLUB_MATE));
    assertEq(Amount.get(materials[1][0]), 1000);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: level == 4
    assertEq(Level.get(coreEntity), 4);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel4() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 4
    // _ GOALS
    // - 1000 MONSTER
    // - 1000 PRIME
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 4");

    // Warp to level
    world.warp(4);

    // Build splitter #1
    bytes32 splitter1Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Connect inlet to splitter #1
    world.connect(inletEntity, splitter1Entity, PORT_INDEX.FIRST);
    // Connect splitter to core
    world.connect(splitter1Entity, coreEntity, PORT_INDEX.FIRST);
    // Build boiler #1
    bytes32 boiler1Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect Splitter to boiler #1
    world.connect(splitter1Entity, boiler1Entity, PORT_INDEX.SECOND);
    // Connect boiler #1 to outlet
    world.connect(boiler1Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 11 blocks for monster to be produced
    vm.roll(block.number + 20);

    // Disconnect boiler #1 from outlet
    world.disconnect(boiler1Entity, PORT_INDEX.FIRST);
    // Build mixer #1
    bytes32 mixer1Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect core piss to mixer #1
    world.connect(coreEntity, mixer1Entity, PORT_INDEX.FIRST);
    // Connect core blood to mixer #1
    world.connect(coreEntity, mixer1Entity, PORT_INDEX.SECOND);
    // Build boiler #2
    bytes32 boiler2Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect mixer to boiler #2
    world.connect(mixer1Entity, boiler2Entity, PORT_INDEX.FIRST);
    // Build boiler #3
    bytes32 boiler3Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect boiler #2 to boiler #3
    world.connect(boiler2Entity, boiler3Entity, PORT_INDEX.FIRST);
    // Connect boiler #3 to outlet
    world.connect(boiler3Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 11 blocks for Prime to be produced
    vm.roll(block.number + 40);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 1000 MONSTER and 1000 PRIME
    assertEq(materials.length, 2);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.MONSTER));
    assertEq(Amount.get(materials[0][0]), 1000);
    assertEq(uint8(MaterialType.get(materials[1][0])), uint8(MATERIAL_TYPE.PRIME));
    assertEq(Amount.get(materials[1][0]), 1000);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: level == 5
    assertEq(Level.get(coreEntity), 5);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel5() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 5
    // _ GOALS
    // - 1000 Plant
    // - 1000 Sludge
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 5");

    // Warp to level
    world.warp(5);

    // Build mixer #1
    bytes32 mixer1Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect inlet to core
    world.connect(inletEntity, coreEntity, PORT_INDEX.FIRST);
    // Connect core piss to mixer #1
    world.connect(coreEntity, mixer1Entity, PORT_INDEX.FIRST);
    // Connect core blood to mixer #1
    world.connect(coreEntity, mixer1Entity, PORT_INDEX.SECOND);
    // Build dryer #1
    bytes32 dryer1Entity = world.build(MACHINE_TYPE.DRYER);
    // Connect mixer #1 to dryer #1
    world.connect(mixer1Entity, dryer1Entity, PORT_INDEX.FIRST);
    // Build wetter #1
    bytes32 wetter1Entity = world.build(MACHINE_TYPE.WETTER);
    // Connect dryer #1 to wetter #1
    world.connect(dryer1Entity, wetter1Entity, PORT_INDEX.FIRST);
    // Connect wetter #1 to outlet
    world.connect(wetter1Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 20 blocks to produce plant
    vm.roll(block.number + 20);

    // Disconnect dryer #1 from wetter #1
    world.disconnect(dryer1Entity, PORT_INDEX.FIRST);
    // Disconnect wetter #1 from outlet
    world.disconnect(wetter1Entity, PORT_INDEX.FIRST);
    // Build boiler #1
    bytes32 boiler1Entity = world.build(MACHINE_TYPE.BOILER);
    // Build boiler #2
    bytes32 boiler2Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect dryer #1 to boiler #1
    world.connect(dryer1Entity, boiler1Entity, PORT_INDEX.FIRST);
    // Connect boiler #1 to boiler #2
    world.connect(boiler1Entity, boiler2Entity, PORT_INDEX.FIRST);
    // Connect boiler #2 to outlet
    world.connect(boiler2Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 20 blocks to produce sludge
    vm.roll(block.number + 20);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 1000 Plant and 1000 Sludge
    assertEq(materials.length, 2);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.PLANT));
    assertEq(Amount.get(materials[0][0]), 1000);
    assertEq(uint8(MaterialType.get(materials[1][0])), uint8(MATERIAL_TYPE.SLUDGE));
    assertEq(Amount.get(materials[1][0]), 1000);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: level == 6
    assertEq(Level.get(coreEntity), 6);

    endGasReport();

    vm.stopPrank();
  }

  function testLevel6() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 6
    // _ GOALS
    // - 1000 Cigarette Juice
    // - 1000 M150
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 6");

    // Warp to level
    world.warp(6);

    // Build splitter #1
    bytes32 splitter1Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Connect inlet to splitter #1
    world.connect(inletEntity, splitter1Entity, PORT_INDEX.FIRST);
    // Connect splitter #1 to core
    world.connect(splitter1Entity, coreEntity, PORT_INDEX.FIRST);
    // Build splitter #2
    bytes32 splitter2Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Connect core piss to splitter #2
    world.connect(coreEntity, splitter2Entity, PORT_INDEX.FIRST);
    // Build boiler #1
    bytes32 boiler1Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect splitter #1 to boiler #1
    world.connect(splitter1Entity, boiler1Entity, PORT_INDEX.SECOND);
    // Build mixer #2
    bytes32 mixer2Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect boiler #1 to mixer #2
    world.connect(boiler1Entity, mixer2Entity, PORT_INDEX.FIRST);
    // Connect splitter #2 to mixer #2
    world.connect(splitter2Entity, mixer2Entity, PORT_INDEX.FIRST);
    // Connect mixer #2 to outlet
    world.connect(mixer2Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 20 blocks to produce M150
    vm.roll(block.number + 20);

    // Disconnect mixer #2 from outlet
    world.disconnect(mixer2Entity, PORT_INDEX.FIRST);
    // Build boiler #2
    bytes32 boiler2Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect core blood to boiler #2
    world.connect(coreEntity, boiler2Entity, PORT_INDEX.SECOND);
    // Build dryer #1
    bytes32 dryer1Entity = world.build(MACHINE_TYPE.DRYER);
    // Connect boiler #2 to dryer #1
    world.connect(boiler2Entity, dryer1Entity, PORT_INDEX.FIRST);
    // Build wetter #1
    bytes32 wetter1Entity = world.build(MACHINE_TYPE.WETTER);
    // Connect dryer #1 to wetter #1
    world.connect(dryer1Entity, wetter1Entity, PORT_INDEX.FIRST);
    // Build dryer #2
    bytes32 dryer2Entity = world.build(MACHINE_TYPE.DRYER);
    // Connect wetter #1 to dryer #2
    world.connect(wetter1Entity, dryer2Entity, PORT_INDEX.FIRST);
    // Build wetter #2
    bytes32 wetter2Entity = world.build(MACHINE_TYPE.WETTER);
    // Connect dryer #2 to wetter #2
    world.connect(dryer2Entity, wetter2Entity, PORT_INDEX.FIRST);
    // Connect wetter #2 to outlet
    world.connect(wetter2Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 40 blocks to produce Cigarette Juice
    vm.roll(block.number + 40);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 1000 M150 and 1000 Cigarette juice
    assertEq(materials.length, 2);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.M150));
    assertEq(Amount.get(materials[0][0]), 1000);
    assertEq(uint8(MaterialType.get(materials[1][0])), uint8(MATERIAL_TYPE.CIGARETTE_JUICE));
    assertEq(Amount.get(materials[1][0]), 1000);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.transfer();

    // Assert: level == 6
    assertEq(Level.get(coreEntity), 7);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel7() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 7:
    // _ GOALS
    // - 1000 ERASERBABY
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 7");

    // Warp to level
    world.warp(7);

    // Build splitter #1
    bytes32 splitter1Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Build splitter #2
    bytes32 splitter2Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Build splitter #3
    bytes32 splitter3Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Connect inlet to splitter #1
    world.connect(inletEntity, splitter1Entity, PORT_INDEX.FIRST);
    // Connect splitter #1 to core
    world.connect(splitter1Entity, coreEntity, PORT_INDEX.FIRST);
    // Build boiler #1
    bytes32 boiler1Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect splitter #1 to boiler #1
    world.connect(splitter1Entity, boiler1Entity, PORT_INDEX.SECOND);
    // Connect core piss to splitter #2
    world.connect(coreEntity, splitter2Entity, PORT_INDEX.FIRST);
    // Build mixer #1
    bytes32 mixer1Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect splitter #2 to mixer #1
    world.connect(splitter2Entity, mixer1Entity, PORT_INDEX.FIRST);
    // Connect boiler #1 to mixer #1
    world.connect(boiler1Entity, mixer1Entity, PORT_INDEX.FIRST);
    // Connect splitter #2 to splitter #3
    world.connect(splitter2Entity, splitter3Entity, PORT_INDEX.SECOND);
    // Build mixer #2
    bytes32 mixer2Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect splitter #3 to mixer #2
    world.connect(splitter3Entity, mixer2Entity, PORT_INDEX.FIRST);
    // Connect mixer #1 to mixer #2
    world.connect(mixer1Entity, mixer2Entity, PORT_INDEX.FIRST);
    // Build splitter #4
    bytes32 splitter4Entity = world.build(MACHINE_TYPE.SPLITTER);
    // Build boiler #2
    bytes32 boiler2Entity = world.build(MACHINE_TYPE.BOILER);
    // Build dryer #1
    bytes32 dryer1Entity = world.build(MACHINE_TYPE.DRYER);
    // Connect core blood to splitter #4
    world.connect(coreEntity, splitter4Entity, PORT_INDEX.SECOND);
    // Connect splitter #4 to boiler #2
    world.connect(splitter4Entity, boiler2Entity, PORT_INDEX.FIRST);
    // Connect boiler #2 to dryer #1
    world.connect(boiler2Entity, dryer1Entity, PORT_INDEX.FIRST);
    // Build wetter #1
    bytes32 wetter1Entity = world.build(MACHINE_TYPE.WETTER);
    // Build dryer #2
    bytes32 dryer2Entity = world.build(MACHINE_TYPE.DRYER);
    // Build wetter #2
    bytes32 wetter2Entity = world.build(MACHINE_TYPE.WETTER);
    // Connect dryer #1 to wetter #1
    world.connect(dryer1Entity, wetter1Entity, PORT_INDEX.FIRST);
    // Connect wetter #1 to dryer #2
    world.connect(wetter1Entity, dryer2Entity, PORT_INDEX.FIRST);
    // Connect dryer #2 to wetter #2
    world.connect(dryer2Entity, wetter2Entity, PORT_INDEX.FIRST);
    // Build boiler #3
    bytes32 boiler3Entity = world.build(MACHINE_TYPE.BOILER);
    // Connect splitter #4 to boiler #3
    world.connect(splitter4Entity, boiler3Entity, PORT_INDEX.SECOND);
    // Build mixer #3
    bytes32 mixer3Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect boiler #3 to mixer #3
    world.connect(boiler3Entity, mixer3Entity, PORT_INDEX.FIRST);
    // Connect wetter #2 to mixer #3
    world.connect(wetter2Entity, mixer3Entity, PORT_INDEX.FIRST);
    // Build mixer #4
    bytes32 mixer4Entity = world.build(MACHINE_TYPE.MIXER);
    // Connect mixer #3 to mixer #4
    world.connect(mixer3Entity, mixer4Entity, PORT_INDEX.FIRST);
    // Connect mixer #2 to mixer #4
    world.connect(mixer2Entity, mixer4Entity, PORT_INDEX.FIRST);
    // Connect mixer #4 to outlet
    world.connect(mixer4Entity, outletEntity, PORT_INDEX.FIRST);
    // Wait 170 blocks to produce Eraserbaby
    vm.roll(block.number + 170);

    // * * * * * * * * * * * * * * * * * * *

    // Resolve
    world.resolve();

    // Get materials
    bytes32[][] memory materials = LibPod.getMaterialsByBox(CarriedBy.get(coreEntity));

    // Log materials
    logMaterials(materials);

    // Products should be 1020 ERASERBABY
    assertEq(materials.length, 1);
    assertEq(uint8(MaterialType.get(materials[0][0])), uint8(MATERIAL_TYPE.ERASERBABY));
    assertEq(Amount.get(materials[0][0]), 1020);

    // * * * * * * * * * * * * * * * * * * *

    // Transfer
    world.complete();

    // Assert: level == 8
    assertEq(Level.get(coreEntity), 8);

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }
}
