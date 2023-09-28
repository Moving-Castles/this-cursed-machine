// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { console } from "forge-std/console.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/common.sol";

contract ResolutionSystemTest is MudTest {
  IWorld world;
  address internal alice;
  address internal bob;
  GameConfigData gameConfig;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get(world);
    alice = address(111);
    bob = address(222);
  }

  // 1. Spawn core
  // 2. Create inlet
  // 3. Create outlet
  // 4. Connect inlet to core
  // 5. Connect core to outlet
  // 6. Wait 10 blocks
  // 7. Resolve network
  // 8. Check outlet pool
  // Expected result:
  //    1 pellet => 1 x 2 pellets => 2 pellets
  //    x 10 blocks
  //    = 20 pellets in output pool
  function testResolve() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    // world.spawn();
    world.spawn();
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // 2. Create an inlet entity
    vm.startPrank(alice);
    // bytes32 inletEntity = world.build(MACHINE_TYPE.INLET, 1, 2);
    bytes32 inletEntity = world.build(MACHINE_TYPE.INLET, 1, 2);
    vm.stopPrank();

    // 3. Create an outlet entity
    vm.startPrank(alice);
    bytes32 outletEntity = world.build(MACHINE_TYPE.OUTLET, 3, 2);
    vm.stopPrank();

    // 3. Create a blender entity
    vm.startPrank(alice);
    bytes32 blenderEntity = world.build(MACHINE_TYPE.BLENDER, 3, 3);
    vm.stopPrank();

    // ... Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // ... Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // ... Get blender ports
    bytes32[][] memory blenderInputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.INPUT);
    bytes32[][] memory blenderOutputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.OUTPUT);

    // .. Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output to blender input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[0][0], blenderInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect blender output to outlet input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, blenderOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // 8.Check outlet pool
  }

  function testResolve2() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    world.spawn();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% RESOLVE 2");
    console.log("%%%%%%%%%");

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // 2. Create an inlet entity
    vm.startPrank(alice);
    bytes32 inletEntity = world.build(MACHINE_TYPE.INLET, 1, 2);
    vm.stopPrank();

    // 3. Create an outlet entity
    vm.startPrank(alice);
    bytes32 outletEntity = world.build(MACHINE_TYPE.OUTLET, 3, 2);
    vm.stopPrank();

    // ... Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // ... Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // .. Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output to outlet input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // 8. Check outlet pool
  }

  function testResolve3() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    world.spawn();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% RESOLVE 2");
    console.log("%%%%%%%%%");

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // 2. Create an inlet entity
    vm.startPrank(alice);
    bytes32 inletEntity = world.build(MACHINE_TYPE.INLET, 1, 2);
    vm.stopPrank();

    // 3. Create an outlet entity
    vm.startPrank(alice);
    bytes32 outletEntity = world.build(MACHINE_TYPE.OUTLET, 3, 2);
    vm.stopPrank();

    // ... Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // ... Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // .. Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 1 to outlet input 1
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 2 to outlet input 2
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[1][0], outletInputPorts[1][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // 8. Check outlet pool
  }

  function testMakeTeeth() public {
    setUp();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% MAKE TEETH");
    console.log("%%%%%%%%%");

    // 1. Spawn core
    vm.startPrank(alice);
    world.spawn();
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // 2. Create an inlet entity
    vm.startPrank(alice);
    bytes32 inletEntity = world.build(MACHINE_TYPE.INLET, 1, 2);
    vm.stopPrank();

    // 3. Create an outlet entity
    vm.startPrank(alice);
    bytes32 outletEntity = world.build(MACHINE_TYPE.OUTLET, 3, 2);
    vm.stopPrank();

    // 3. Create a blender entity
    vm.startPrank(alice);
    bytes32 blenderEntity = world.build(MACHINE_TYPE.BLENDER, 3, 3);
    vm.stopPrank();

    // ... Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // ... Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // ... Get blender ports
    bytes32[][] memory blenderInputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.INPUT);
    bytes32[][] memory blenderOutputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.OUTPUT);

    // .. Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 1 to blender input 1
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[0][0], blenderInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 1 to blender input 1
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[1][0], blenderInputPorts[1][0]);
    vm.stopPrank();

    // 5. Connect blender output to outlet input
    vm.startPrank(alice);
    world.connect(CONNECTION_TYPE.RESOURCE, blenderOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // 8.Check outlet pool
  }
}
