// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE, ROTATION } from "../../src/codegen/Types.sol";

contract ConnectionSystemTest is MudV2Test {
  function testConnect() public {
    setUp();

    vm.startPrank(alice);
    world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    vm.startPrank(alice);
    bytes32 newEntity = world.mc_BuildSystem_build(MACHINE_TYPE.BLENDER, 1, 2, ROTATION.DEG0);
    vm.stopPrank();

    // Get input ports for new entity
    bytes32[][] memory newEntityInputPorts = LibPort.getPorts(world, newEntity, PORT_TYPE.INPUT);

    // Get output port for core
    bytes32[][] memory coreEntityOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Connect
    vm.startPrank(alice);
    bytes32 connection = world.mc_ConnectionSystem_connect(
      CONNECTION_TYPE.RESOURCE,
      coreEntityOutputPorts[0][0],
      newEntityInputPorts[0][0]
    );
    vm.stopPrank();

    // Check that the connection was created
    assertEq(uint8(EntityType.get(world, connection)), uint8(ENTITY_TYPE.CONNECTION));
    assertEq(SourcePort.get(world, connection), coreEntityOutputPorts[0][0]);
    assertEq(TargetPort.get(world, connection), newEntityInputPorts[0][0]);
  }
}
