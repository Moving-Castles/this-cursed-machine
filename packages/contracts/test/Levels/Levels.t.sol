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

    // -------
    // LEVEL 1
    // GOALS:
    // - 101 core energy
    // -------

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

    // -------
    // LEVEL 2
    // -------

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

    // -------
    // LEVEL 3
    // -------

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

    // -------
    // LEVEL 4
    // -------

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
}
