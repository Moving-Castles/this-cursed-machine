// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { console } from "forge-std/console.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, PORT_TYPE } from "../../src/codegen/common.sol";

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
  //    1 bug => 1 x 2 bugs => 2 bugs
  //    x 10 blocks
  //    = 20 bugs in output pool
  function testResolve() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% RESOLVE 1");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // 3. Create a splitter entity
    vm.startPrank(alice);
    bytes32 blenderEntity = world.build(MACHINE_TYPE.SPLITTER);
    vm.stopPrank();

    // ... Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    console.log("inletOutputPorts.length");
    console.log(inletOutputPorts.length);

    // ... Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    console.log("coreOutputPorts.length");
    console.log(coreOutputPorts.length);

    // ... Get blender ports
    bytes32[][] memory blenderInputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.INPUT);
    bytes32[][] memory blenderOutputPorts = LibPort.getPorts(world, blenderEntity, PORT_TYPE.OUTPUT);

    // .. Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output to blender input
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], blenderInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect blender output to outlet input
    vm.startPrank(alice);
    world.connect(blenderOutputPorts[0][0], outletInputPorts[0][0]);
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
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% RESOLVE 2");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // console.log("outletInputPorts.length");
    // console.log(outletInputPorts.length);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 1 to outlet input
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], outletInputPorts[0][0]);
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
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% RESOLVE 3");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 1 to outlet input 1
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect core output 2 to outlet input 2
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // 8. Check outlet pool
  }

  function testEnergyTickDown() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    // 2. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    assertEq(uint8(Energy.get(world, coreEntity)), 90);
  }

  function testBugsToEnergy() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core input ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);

    // 4. Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 100 blocks
    vm.roll(block.number + 40);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // Starting energy: 100
    // Connection cost : 10
    // 40 blocks: 40 bugs => 40 energy
    // == 130 energy
    assertEq(uint8(Energy.get(world, coreEntity)), 130);
  }

  function testMakeSludge() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% MAKE SLUDGE");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // console.log("coreOutputPorts.length");
    // console.log(coreOutputPorts.length);

    // Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    vm.roll(block.number + 100);

    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    console.log("energy");
    console.log(Energy.get(world, coreEntity));

    // Create a dryer entity
    vm.startPrank(alice);
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);
    vm.stopPrank();

    // Get dryer ports
    bytes32[][] memory dryerInputPorts = LibPort.getPorts(world, dryerEntity, PORT_TYPE.INPUT);
    bytes32[][] memory dryerOutputPorts = LibPort.getPorts(world, dryerEntity, PORT_TYPE.OUTPUT);

    console.log("dryerInputPorts.length");
    console.log(dryerInputPorts.length);

    console.log("dryerOutputPorts.length");
    console.log(dryerOutputPorts.length);

    // Connect core outputs to dryer input
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], dryerInputPorts[0][0]);
    vm.stopPrank();

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // Connect dryer output to outlet input
    vm.startPrank(alice);
    world.connect(dryerOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // Check outlet pool
    bytes32[][] memory materials = LibBox.getMaterialsByBox(world, CarriedBy.get(coreEntity));

    console.log("materials.length");
    console.log(materials.length);
    console.log("MaterialType.get(world, materials[0][0])");
    console.log(uint256(MaterialType.get(world, materials[0][0])));
  }

  function testMakeCHL() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% MAKE CHL");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // console.log("coreOutputPorts.length");
    // console.log(coreOutputPorts.length);

    // Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    vm.roll(block.number + 100);

    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    console.log("energy");
    console.log(Energy.get(world, coreEntity));

    // Create a mixer entity
    vm.startPrank(alice);
    bytes32 mixerEntity = world.build(MACHINE_TYPE.MIXER);
    vm.stopPrank();

    // Get mixer ports
    bytes32[][] memory mixerInputPorts = LibPort.getPorts(world, mixerEntity, PORT_TYPE.INPUT);
    bytes32[][] memory mixerOutputPorts = LibPort.getPorts(world, mixerEntity, PORT_TYPE.OUTPUT);

    console.log("mixerInputPorts.length");
    console.log(mixerInputPorts.length);

    console.log("mixerOutputPorts.length");
    console.log(mixerOutputPorts.length);

    // Connect core outputs to mixer inputs
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], mixerInputPorts[0][0]);
    world.connect(coreOutputPorts[1][0], mixerInputPorts[1][0]);
    vm.stopPrank();

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // Connect mixer output to outlet input
    vm.startPrank(alice);
    world.connect(mixerOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // Check outlet pool
    bytes32[][] memory materials = LibBox.getMaterialsByBox(world, CarriedBy.get(coreEntity));

    console.log("materials.length");
    console.log(materials.length);
    console.log("MaterialType.get(world, materials[0][0])");
    console.log(uint256(MaterialType.get(world, materials[0][0])));
  }

  function testMaterialConsolidation() public {
    setUp();

    // 1. Spawn core
    vm.startPrank(alice);
    bytes32 coreEntity = world.spawn();
    world.transfer();
    vm.stopPrank();

    console.log("%%%%%%%%%");
    console.log("%%%%%%%%% MAKE SLUDGE");
    console.log("%%%%%%%%%");

    // Get inlet entity
    bytes32[][] memory inletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.INLET
    );
    bytes32 inletEntity = inletEntities[0][0];

    // Get outlet entity
    bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(
      world,
      CarriedBy.get(coreEntity),
      MACHINE_TYPE.OUTLET
    );
    bytes32 outletEntity = outletEntities[0][0];

    // Get inlet output ports
    bytes32[][] memory inletOutputPorts = LibPort.getPorts(world, inletEntity, PORT_TYPE.OUTPUT);

    // Get core ports
    bytes32[][] memory coreInputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.INPUT);
    bytes32[][] memory coreOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Get outlet input ports
    bytes32[][] memory outletInputPorts = LibPort.getPorts(world, outletEntity, PORT_TYPE.INPUT);

    // console.log("coreOutputPorts.length");
    // console.log(coreOutputPorts.length);

    // Connect inlet output to core input
    vm.startPrank(alice);
    world.connect(inletOutputPorts[0][0], coreInputPorts[0][0]);
    vm.stopPrank();

    vm.roll(block.number + 100);

    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    console.log("energy");
    console.log(Energy.get(world, coreEntity));

    // Create a dryer entity
    vm.startPrank(alice);
    bytes32 dryerEntity = world.build(MACHINE_TYPE.DRYER);
    vm.stopPrank();

    // Get dryer ports
    bytes32[][] memory dryerInputPorts = LibPort.getPorts(world, dryerEntity, PORT_TYPE.INPUT);
    bytes32[][] memory dryerOutputPorts = LibPort.getPorts(world, dryerEntity, PORT_TYPE.OUTPUT);

    console.log("dryerInputPorts.length");
    console.log(dryerInputPorts.length);

    console.log("dryerOutputPorts.length");
    console.log(dryerOutputPorts.length);

    // Connect core outputs to dryer input
    vm.startPrank(alice);
    world.connect(coreOutputPorts[0][0], dryerInputPorts[0][0]);
    vm.stopPrank();

    console.log("outletInputPorts.length");
    console.log(outletInputPorts.length);

    // Connect dryer output to outlet input
    vm.startPrank(alice);
    world.connect(dryerOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.resolve();
    vm.stopPrank();

    // Check outlet pool
    bytes32[][] memory materials = LibBox.getMaterialsByBox(world, CarriedBy.get(coreEntity));

    console.log("materials.length");
    console.log(materials.length);
  }
}
