// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ROTATION, ENTITY_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/Types.sol";

contract ResolutionSystemTest is MudV2Test {
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
    world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // 2. Create an inlet entity
    vm.startPrank(alice);
    bytes32 inletEntity = world.mc_BuildSystem_build(MACHINE_TYPE.INLET, 1, 2, ROTATION.DEG0);
    vm.stopPrank();

    // 3. Create an outlet entity
    vm.startPrank(alice);
    bytes32 outletEntity = world.mc_BuildSystem_build(MACHINE_TYPE.OUTLET, 3, 2, ROTATION.DEG0);
    vm.stopPrank();

    // 3. Create a blender entity
    vm.startPrank(alice);
    bytes32 blenderEntity = world.mc_BuildSystem_build(MACHINE_TYPE.BLENDER, 3, 3, ROTATION.DEG0);
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
    bytes32 connectionOneEntity = world.mc_ConnectionSystem_connect(
      CONNECTION_TYPE.RESOURCE,
      inletOutputPorts[0][0],
      coreInputPorts[0][0]
    );
    vm.stopPrank();

    // 5. Connect core output to blender input
    vm.startPrank(alice);
    world.mc_ConnectionSystem_connect(CONNECTION_TYPE.RESOURCE, coreOutputPorts[0][0], blenderInputPorts[0][0]);
    vm.stopPrank();

    // 5. Connect blender output to outlet input
    vm.startPrank(alice);
    world.mc_ConnectionSystem_connect(CONNECTION_TYPE.RESOURCE, blenderOutputPorts[0][0], outletInputPorts[0][0]);
    vm.stopPrank();

    // 6. Wait 10 blocks
    vm.roll(block.number + 10);

    // 7. Resolve
    vm.startPrank(alice);
    world.mc_ResolutionSystem_resolve();
    vm.stopPrank();

    // 8.Check outlet pool
  }
}
