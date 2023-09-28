// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import "../../src/codegen/index.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, PORT_TYPE, PORT_PLACEMENT, CONNECTION_TYPE } from "../../src/codegen/common.sol";

contract ConnectionSystemTest is MudTest {
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

  function testConnect() public {
    setUp();

    vm.startPrank(alice);
    // world.mc_SpawnSystem_spawn();
    world.spawn();
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    // Create a new entity
    vm.startPrank(alice);
    // bytes32 newEntity = world.mc_BuildSystem_build(MACHINE_TYPE.BLENDER, 1, 2);
    bytes32 newEntity = world.build(MACHINE_TYPE.BLENDER, 1, 2);
    vm.stopPrank();

    // Get input ports for new entity
    bytes32[][] memory newEntityInputPorts = LibPort.getPorts(world, newEntity, PORT_TYPE.INPUT);

    // Get output port for core
    bytes32[][] memory coreEntityOutputPorts = LibPort.getPorts(world, coreEntity, PORT_TYPE.OUTPUT);

    // Connect
    vm.startPrank(alice);
    // bytes32 connection = world.mc_ConnectionSystem_connect(
    //   CONNECTION_TYPE.RESOURCE,
    //   coreEntityOutputPorts[0][0],
    //   newEntityInputPorts[0][0]
    // );
    bytes32 connection = world.connect(
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
