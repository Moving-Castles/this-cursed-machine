// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { console } from "forge-std/console.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { GasReporter } from "@latticexyz/gas-report/src/GasReporter.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, PORT_TYPE } from "../../src/codegen/common.sol";

contract LevelsTest is MudTest, GasReporter {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;
  bytes32 coreEntity;
  bytes32 inletEntity;
  bytes32 outletEntity;
  bytes32 inletOutputPort;
  bytes32 coreInputPort;
  bytes32 corePissPort;
  bytes32 coreBloodPort;
  bytes32 outletInputPort;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get();
    alice = address(111);
    bob = address(222);

    vm.startPrank(alice);

    // ---
    // PRE
    // ---
    // Spawn core
    coreEntity = world.spawn();
    // Restart (to transfer to pod)
    world.restart();

    vm.stopPrank();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.INLET);
    inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.OUTLET);
    outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(inletEntity, PORT_TYPE.OUTPUT);
    inletOutputPort = inletOutputPorts[0][0];

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(coreEntity, PORT_TYPE.INPUT);
    coreInputPort = coreInputPorts[0][0];
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(coreEntity, PORT_TYPE.OUTPUT);
    corePissPort = coreOutputPorts[0][0];
    coreBloodPort = coreOutputPorts[1][0];

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(outletEntity, PORT_TYPE.INPUT);
    outletInputPort = outletInputPorts[0][0];
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
    world.connect(inletOutputPort, coreInputPort);
    // * Wait 10 block
    vm.roll(block.number + 10);
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

    // Connect inlet to core
    world.connect(inletOutputPort, coreInputPort);
    // Connect core piss port to outlet
    bytes32 pissConnection = world.connect(corePissPort, outletInputPort);
    // * Wait 11 blocks
    vm.roll(block.number + 11);
    // Disconnect piss connection
    world.disconnect(pissConnection);
    // Connect core blood port to outlet
    world.connect(coreBloodPort, outletInputPort);
    // * Wait 11 blocks
    vm.roll(block.number + 11);
    // Transfer
    world.transfer();
    // Assert: level == 3
    // @todo Fake level to previous one to make transfer work as expected
    // assertEq(Level.get(coreEntity), 3);
    // @todo Check that goal materials have in fact been produced

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

    // Connect inlet to core
    world.connect(inletOutputPort, coreInputPort);
    // Build mixer
    bytes32 mixerEntity = world.build(MACHINE_TYPE.MIXER);
    // Get mixer ports
    bytes32[][] memory mixerInputPorts = LibPort.getPorts(mixerEntity, PORT_TYPE.INPUT);
    bytes32[][] memory mixerOutputPorts = LibPort.getPorts(mixerEntity, PORT_TYPE.OUTPUT);
    // Connect core piss port to mixer
    world.connect(corePissPort, mixerInputPorts[0][0]);
    // Connect core blood port to mixer
    world.connect(corePissPort, mixerInputPorts[1][0]);
    // Connect mixer to outlet
    bytes32 mixerConnection = world.connect(mixerOutputPorts[0][0], outletInputPort);
    // Wait 11 blocks
    vm.roll(block.number + 11);
    // Disconnect mixer connection
    world.disconnect(mixerConnection);
    // Build Cooler
    bytes32 coolerEntity = world.build(MACHINE_TYPE.COOLER);
    bytes32[][] memory coolerInputPorts = LibPort.getPorts(coolerEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coolerOutputPorts = LibPort.getPorts(coolerEntity, PORT_TYPE.OUTPUT);
    // Connect mixer to Cooler
    world.connect(mixerOutputPorts[0][0], coolerInputPorts[0][0]);
    // Connect Cooler to outlet
    world.connect(coolerOutputPorts[0][0], outletInputPort);
    // * Wait 11 blocks
    vm.roll(block.number + 11);
    // Transfer
    world.transfer();
    // Assert: level == 4
    // @todo Fake level to previous one to make transfer work as expected
    // assertEq(Level.get(coreEntity), 4);

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

    // Build splitter #1
    bytes32 splitterEntity1 = world.build(MACHINE_TYPE.SPLITTER);
    // Get splitter ports
    bytes32[][] memory splitterInputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory splitterOutputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.OUTPUT);
    // Connect inlet to splitter #1
    world.connect(inletOutputPort, splitterInputPorts1[0][0]);
    // Connect splitter to core
    world.connect(splitterOutputPorts1[0][0], coreInputPort);
    // Build boiler #1
    bytes32 boilerEntity1 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler ports
    bytes32[][] memory boilerInputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.OUTPUT);
    // Connect Splitter to boiler #1
    world.connect(splitterOutputPorts1[1][0], boilerInputPorts1[0][0]);
    // Connect boiler #1 to outlet
    world.connect(boilerOutputPorts1[0][0], outletInputPort);
    // Wait 11 blocks for monster to be produced
    vm.roll(block.number + 11);
    // Build mixer #1
    bytes32 mixerEntity1 = world.build(MACHINE_TYPE.MIXER);
    // Get mixer ports
    bytes32[][] memory mixerInputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory mixerOutputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.OUTPUT);
    // Connect core piss port to mixer #1
    world.connect(corePissPort, mixerInputPorts1[0][0]);
    // Connect core blood port to mixer #1
    world.connect(coreBloodPort, mixerInputPorts1[1][0]);
    // Build boiler #2
    bytes32 boilerEntity2 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #2 ports
    bytes32[][] memory boilerInputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.OUTPUT);
    // Build boiler #3
    bytes32 boilerEntity3 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #3 ports
    bytes32[][] memory boilerInputPorts3 = LibPort.getPorts(boilerEntity3, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts3 = LibPort.getPorts(boilerEntity3, PORT_TYPE.OUTPUT);
    // Connect mixer to boiler #2
    world.connect(mixerOutputPorts1[0][0], boilerInputPorts2[0][0]);
    // Connect boiler #2 to boiler #3
    world.connect(boilerOutputPorts2[0][0], boilerInputPorts3[0][0]);
    // Connect boiler #3 to outlet
    world.connect(boilerOutputPorts3[0][0], outletInputPort);
    // Wait 11 blocks for Prime to be produced
    vm.roll(block.number + 11);
    // Transfer
    world.transfer();
    // Assert: level == 5
    // @todo Fake level to previous one to make transfer work as expected
    // assertEq(Level.get(coreEntity), 5);
    // @todo Check that goal materials have in fact been produced

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

    // Build mixer #1
    bytes32 mixerEntity1 = world.build(MACHINE_TYPE.MIXER);
    // Get mixer ports
    bytes32[][] memory mixerInputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory mixerOutputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.OUTPUT);
    // Connect inlet to core
    world.connect(inletOutputPort, coreInputPort);
    // Connect core piss to mixer #1
    world.connect(corePissPort, mixerInputPorts1[0][0]);
    // Connect core blood to mixer #1
    world.connect(coreBloodPort, mixerInputPorts1[1][0]);
    // Build dryer #1
    bytes32 dryerEntity1 = world.build(MACHINE_TYPE.DRYER);
    // Get dryer ports
    bytes32[][] memory dryerInputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory dryerOutputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.OUTPUT);
    // Connect mixer #1 to dryer #1
    world.connect(mixerOutputPorts1[0][0], dryerInputPorts1[0][0]);
    // Build wetter #1
    bytes32 wetterEntity1 = world.build(MACHINE_TYPE.WETTER);
    // Get wetter ports
    bytes32[][] memory wetterInputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory wetterOutputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.OUTPUT);
    // Connect dryer #1 to wetter #1
    bytes32 dryerToWetterConnection = world.connect(dryerOutputPorts1[0][0], wetterInputPorts1[0][0]);
    // Connect wetter #1 to outlet
    world.connect(wetterOutputPorts1[0][0], outletInputPort);
    // Wait 11 blocks to produce plant
    vm.roll(block.number + 11);
    // Build boiler #1
    bytes32 boilerEntity1 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #1 ports
    bytes32[][] memory boilerInputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.OUTPUT);
    // Build boiler #2
    bytes32 boilerEntity2 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #2 ports
    bytes32[][] memory boilerInputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.OUTPUT);
    // Disconnect dryer #1 to wetter #1
    world.disconnect(dryerToWetterConnection);
    // Connect dryer #1 to boiler #1
    world.connect(dryerOutputPorts1[0][0], boilerInputPorts1[0][0]);
    // Connect boiler #1 to boiler #2
    world.connect(boilerOutputPorts1[0][0], boilerInputPorts2[0][0]);
    // Connect boiler #2 to outlet
    world.connect(boilerOutputPorts2[0][0], outletInputPort);
    // Wait 11 blocks to produce sludge
    vm.roll(block.number + 11);
    // Transfer
    world.transfer();
    // Assert: level == 6
    // @todo Fake level to previous one to make transfer work as expected
    // assertEq(Level.get(coreEntity), 6);
    // @todo Check that goal materials have in fact been produced

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  function testLevel6() public {
    setUp();

    // * * * * * * * * * * * * * * * * * * *
    // * LEVEL 6
    // _ GOALS
    // - 1000 Cigarette Juice
    // - 1000 MD-150
    // * * * * * * * * * * * * * * * * * * *

    vm.startPrank(alice);

    startGasReport("Test level 6");

    // Build splitter #1
    bytes32 splitterEntity1 = world.build(MACHINE_TYPE.SPLITTER);
    // Get splitter #1 ports
    bytes32[][] memory splitterInputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory splitterOutputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.OUTPUT);
    // Connect inlet to splitter #1
    world.connect(inletOutputPort, splitterInputPorts1[0][0]);
    // Connect splitter #1 to core
    world.connect(splitterOutputPorts1[0][0], coreInputPort);

    // Build mixer #1
    bytes32 mixerEntity1 = world.build(MACHINE_TYPE.MIXER);
    // Build splitter #2
    bytes32 splitterEntity2 = world.build(MACHINE_TYPE.SPLITTER);
    // Get splitter #2 ports
    bytes32[][] memory splitterInputPorts2 = LibPort.getPorts(splitterEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory splitterOutputPorts2 = LibPort.getPorts(splitterEntity2, PORT_TYPE.OUTPUT);
    // Connect core piss to splitter #2
    world.connect(corePissPort, splitterInputPorts2[0][0]);

    // Build boiler #1
    bytes32 boilerEntity1 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #1 ports
    bytes32[][] memory boilerInputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.OUTPUT);
    // Connect splitter #1 to boiler #1
    world.connect(splitterOutputPorts1[1][0], boilerInputPorts1[0][0]);

    // Build mixer #2
    bytes32 mixerEntity2 = world.build(MACHINE_TYPE.MIXER);
    // Get mixer #2 ports
    bytes32[][] memory mixerInputPorts2 = LibPort.getPorts(mixerEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory mixerOutputPorts2 = LibPort.getPorts(mixerEntity2, PORT_TYPE.OUTPUT);
    // Connect boiler #1 to mixer #2
    world.connect(boilerOutputPorts1[0][0], mixerInputPorts2[0][0]);
    // Connect splitter #2 to mixer #2
    world.connect(splitterOutputPorts2[0][0], mixerInputPorts2[1][0]);
    // Connect mixer #2 to outlet
    world.connect(mixerOutputPorts2[0][0], outletInputPort);
    // Wait 11 blocks to produce MD-150
    vm.roll(block.number + 11);

    // Build boiler #2
    bytes32 boilerEntity2 = world.build(MACHINE_TYPE.BOILER);
    // Get boiler #2 ports
    bytes32[][] memory boilerInputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory boilerOutputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.OUTPUT);
    // Connect core blood to boiler #2
    world.connect(coreBloodPort, boilerInputPorts2[0][0]);

    // Build dryer #1
    bytes32 dryerEntity1 = world.build(MACHINE_TYPE.DRYER);
    // Get dryer #1 ports
    bytes32[][] memory dryerInputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory dryerOutputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.OUTPUT);
    // Connect boiler #2 to dryer #1
    world.connect(boilerOutputPorts2[0][0], dryerInputPorts1[0][0]);

    // Build wetter #1
    bytes32 wetterEntity1 = world.build(MACHINE_TYPE.WETTER);
    // Get wetter #1 ports
    bytes32[][] memory wetterInputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.INPUT);
    bytes32[][] memory wetterOutputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.OUTPUT);

    // Build wetter #2
    bytes32 wetterEntity2 = world.build(MACHINE_TYPE.WETTER);
    // Get wetter #2 ports
    bytes32[][] memory wetterInputPorts2 = LibPort.getPorts(wetterEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory wetterOutputPorts2 = LibPort.getPorts(wetterEntity2, PORT_TYPE.OUTPUT);

    // Connect dryer #1 to wetter #1
    world.connect(dryerOutputPorts1[0][0], wetterInputPorts1[0][0]);

    // Build dryer #2
    bytes32 dryerEntity2 = world.build(MACHINE_TYPE.DRYER);
    // Get dryer #2 ports
    bytes32[][] memory dryerInputPorts2 = LibPort.getPorts(dryerEntity2, PORT_TYPE.INPUT);
    bytes32[][] memory dryerOutputPorts2 = LibPort.getPorts(dryerEntity2, PORT_TYPE.OUTPUT);

    // Connect wetter #1 to dryer #2
    world.connect(wetterOutputPorts1[0][0], dryerInputPorts2[0][0]);
    // Connect dryer #2 to wetter #2
    world.connect(dryerOutputPorts2[0][0], wetterInputPorts2[0][0]);
    // Connect wetter #2 to outlet
    world.connect(wetterOutputPorts2[0][0], outletInputPort);
    // Wait 11 blocks to produce Cigarette Juice
    vm.roll(block.number + 11);

    // Transfer
    world.transfer();
    // Assert: level == 7
    // @todo Fake level to previous one to make transfer work as expected
    // assertEq(Level.get(coreEntity), 7);
    // @todo Check that goal materials have in fact been produced

    // * * * * * * * * * * * * * * * * * * *

    endGasReport();

    vm.stopPrank();
  }

  // Stack too deep
  // @todo: remove ports
  // function testLevel7() public {
  //   setUp();

  //   // * * * * * * * * * * * * * * * * * * *
  //   // * LEVEL 7
  //   // _ GOALS
  //   // - 1000 ERASERBABY
  //   // * * * * * * * * * * * * * * * * * * *

  //   vm.startPrank(alice);

  //   startGasReport("Test level 7");

  //   // Build and connect splitters
  //   bytes32 splitterEntity1 = world.build(MACHINE_TYPE.SPLITTER);
  //   bytes32 splitterEntity2 = world.build(MACHINE_TYPE.SPLITTER);
  //   bytes32 splitterEntity3 = world.build(MACHINE_TYPE.SPLITTER);
  //   bytes32 splitterEntity4 = world.build(MACHINE_TYPE.SPLITTER);

  //   bytes32[][] memory splitterInputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.INPUT);
  //   bytes32[][] memory splitterOutputPorts1 = LibPort.getPorts(splitterEntity1, PORT_TYPE.OUTPUT);
  //   world.connect(inletOutputPort, splitterInputPorts1[0][0]);
  //   world.connect(splitterOutputPorts1[0][0], coreInputPort);

  //   // Build boiler #1 and connect
  //   bytes32 boilerEntity1 = world.build(MACHINE_TYPE.BOILER);
  //   bytes32[][] memory boilerInputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.INPUT);
  //   bytes32[][] memory boilerOutputPorts1 = LibPort.getPorts(boilerEntity1, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts1[1][0], boilerInputPorts1[0][0]);

  //   // Connect core piss to splitter #2
  //   bytes32[][] memory splitterInputPorts2 = LibPort.getPorts(splitterEntity2, PORT_TYPE.INPUT);
  //   bytes32[][] memory splitterOutputPorts2 = LibPort.getPorts(splitterEntity2, PORT_TYPE.OUTPUT);
  //   world.connect(corePissPort, splitterInputPorts2[0][0]);

  //   // Build mixer #1 and connect
  //   bytes32 mixerEntity1 = world.build(MACHINE_TYPE.MIXER);
  //   bytes32[][] memory mixerInputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.INPUT);
  //   bytes32[][] memory mixerOutputPorts1 = LibPort.getPorts(mixerEntity1, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts2[0][0], mixerInputPorts1[0][0]);
  //   world.connect(boilerOutputPorts1[0][0], mixerInputPorts1[1][0]);

  //   // Connect splitter #2 to splitter #3
  //   bytes32[][] memory splitterInputPorts3 = LibPort.getPorts(splitterEntity3, PORT_TYPE.INPUT);
  //   bytes32[][] memory splitterOutputPorts3 = LibPort.getPorts(splitterEntity3, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts2[1][0], splitterInputPorts3[0][0]);

  //   // Build mixer #2 and connect
  //   bytes32 mixerEntity2 = world.build(MACHINE_TYPE.MIXER);
  //   bytes32[][] memory mixerInputPorts2 = LibPort.getPorts(mixerEntity2, PORT_TYPE.INPUT);
  //   bytes32[][] memory mixerOutputPorts2 = LibPort.getPorts(mixerEntity2, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts3[0][0], mixerInputPorts2[0][0]);
  //   world.connect(mixerOutputPorts1[0][0], mixerInputPorts2[1][0]);

  //   // Connect core blood to splitter #4
  //   bytes32[][] memory splitterInputPorts4 = LibPort.getPorts(splitterEntity4, PORT_TYPE.INPUT);
  //   bytes32[][] memory splitterOutputPorts4 = LibPort.getPorts(splitterEntity4, PORT_TYPE.OUTPUT);
  //   world.connect(coreBloodPort, splitterInputPorts4[0][0]);

  //   // Build boiler #2 and connect
  //   bytes32 boilerEntity2 = world.build(MACHINE_TYPE.BOILER);
  //   bytes32[][] memory boilerInputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.INPUT);
  //   bytes32[][] memory boilerOutputPorts2 = LibPort.getPorts(boilerEntity2, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts4[0][0], boilerInputPorts2[0][0]);

  //   // Build dryer #1 and connect
  //   bytes32 dryerEntity1 = world.build(MACHINE_TYPE.DRYER);
  //   bytes32[][] memory dryerInputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.INPUT);
  //   bytes32[][] memory dryerOutputPorts1 = LibPort.getPorts(dryerEntity1, PORT_TYPE.OUTPUT);
  //   world.connect(boilerOutputPorts2[0][0], dryerInputPorts1[0][0]);

  //   // Build and connect wetter #1 and #2
  //   bytes32 wetterEntity1 = world.build(MACHINE_TYPE.WETTER);
  //   bytes32 wetterEntity2 = world.build(MACHINE_TYPE.WETTER);
  //   bytes32[][] memory wetterInputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.INPUT);
  //   bytes32[][] memory wetterOutputPorts1 = LibPort.getPorts(wetterEntity1, PORT_TYPE.OUTPUT);
  //   bytes32[][] memory wetterInputPorts2 = LibPort.getPorts(wetterEntity2, PORT_TYPE.INPUT);
  //   bytes32[][] memory wetterOutputPorts2 = LibPort.getPorts(wetterEntity2, PORT_TYPE.OUTPUT);
  //   world.connect(dryerOutputPorts1[0][0], wetterInputPorts1[0][0]);

  //   // Build dryer #2 and connect
  //   bytes32 dryerEntity2 = world.build(MACHINE_TYPE.DRYER);
  //   bytes32[][] memory dryerInputPorts2 = LibPort.getPorts(dryerEntity2, PORT_TYPE.INPUT);
  //   bytes32[][] memory dryerOutputPorts2 = LibPort.getPorts(dryerEntity2, PORT_TYPE.OUTPUT);
  //   world.connect(wetterOutputPorts1[0][0], dryerInputPorts2[0][0]);
  //   world.connect(dryerOutputPorts2[0][0], wetterInputPorts2[0][0]);

  //   // Build boiler #3 and connect
  //   bytes32 boilerEntity3 = world.build(MACHINE_TYPE.BOILER);
  //   bytes32[][] memory boilerInputPorts3 = LibPort.getPorts(boilerEntity3, PORT_TYPE.INPUT);
  //   bytes32[][] memory boilerOutputPorts3 = LibPort.getPorts(boilerEntity3, PORT_TYPE.OUTPUT);
  //   world.connect(splitterOutputPorts4[1][0], boilerInputPorts3[0][0]);

  //   // Build mixer #3 and connect
  //   bytes32 mixerEntity3 = world.build(MACHINE_TYPE.MIXER);
  //   bytes32[][] memory mixerInputPorts3 = LibPort.getPorts(mixerEntity3, PORT_TYPE.INPUT);
  //   bytes32[][] memory mixerOutputPorts3 = LibPort.getPorts(mixerEntity3, PORT_TYPE.OUTPUT);
  //   world.connect(boilerOutputPorts3[0][0], mixerInputPorts3[0][0]);
  //   world.connect(wetterOutputPorts2[0][0], mixerInputPorts3[1][0]);

  //   // Build mixer #4 and connect
  //   bytes32 mixerEntity4 = world.build(MACHINE_TYPE.MIXER);
  //   bytes32[][] memory mixerInputPorts4 = LibPort.getPorts(mixerEntity4, PORT_TYPE.INPUT);
  //   bytes32[][] memory mixerOutputPorts4 = LibPort.getPorts(mixerEntity4, PORT_TYPE.OUTPUT);
  //   world.connect(mixerOutputPorts3[0][0], mixerInputPorts4[0][0]);
  //   world.connect(mixerOutputPorts2[0][0], mixerInputPorts4[1][0]);

  //   // Final connection to outlet
  //   world.connect(mixerOutputPorts4[0][0], outletInputPort);

  //   // Wait 11 blocks to produce Eraserbaby
  //   vm.roll(block.number + 11);

  //   // Transfer
  //   world.transfer();

  //   // Assert: level == 8
  //   // @todo Fake level to previous one to make transfer work as expected
  //   // assertEq(Level.get(coreEntity), 8);
  //   // @todo Check that goal materials have in fact been produced

  //   // * * * * * * * * * * * * * * * * * * *

  //   endGasReport();

  //   vm.stopPrank();
  // }
}
