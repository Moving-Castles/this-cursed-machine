// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { EntityType, ConnectionType } from "../../src/codegen/Types.sol";
import { moverEntity, resourceEntity } from "../../src/constants.sol";

contract ConnectSystemTest is MudV2Test {
  // function testResourceConnect() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   uint32 distance = LibMap.manhattanDistance(Position.get(world, coreEntity), Position.get(world, foodSourceEntity));
  //   assertEq(distance, 3);

  //   assertEq(ResourceConnection.get(world, coreEntity), foodSourceEntity);
  //   assertEq(
  //     Energy.get(world, coreEntity),
  //     gameConfig.coreInitialEnergy - (distance * gameConfig.resourceConnectionCost)
  //   );
  // }

  // function testRevertNotEnoughEnergy() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   vm.expectRevert(bytes("not enough energy"));
  //   world.mc_ConnectSystem_connect(ConnectionType.CONTROL, clawEntity);
  //   vm.stopPrank();
  // }

  // function testControlConnect() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   world.mc_DevSystem_set(EnergyTableId, coreEntity, Energy.encode(100));

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.CONTROL, clawEntity);
  //   vm.stopPrank();

  //   uint32 distance = LibMap.manhattanDistance(Position.get(world, coreEntity), Position.get(world, clawEntity));
  //   assertEq(distance, 3);

  //   assertEq(ControlConnection.get(world, coreEntity), clawEntity);
  //   assertEq(Energy.get(world, coreEntity), 100 - (distance * gameConfig.controlConnectionCost));
  // }

  // function testDisconnect() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_disconnect(ConnectionType.RESOURCE);
  //   vm.stopPrank();

  //   assertEq(ResourceConnection.get(world, coreEntity), 0);
  // }

  // function testEnergyCharge() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   uint32 initialEnergy = Energy.get(world, coreEntity);

  //   vm.roll(block.number + 50);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_disconnect(ConnectionType.RESOURCE);
  //   vm.stopPrank();

  //   assertEq(Energy.get(world, coreEntity), initialEnergy + 50);
  // }

  // function testEnergyCap() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

  //   vm.roll(block.number + 5);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   uint32 initialEnergy = Energy.get(world, coreEntity);

  //   vm.roll(block.number + 500);

  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_disconnect(ConnectionType.RESOURCE);
  //   vm.stopPrank();

  //   assertEq(Energy.get(world, coreEntity), gameConfig.coreEnergyCap);
  // }

  // function testMultiEnergyCharge() public {
  //   setUp();

  //   vm.startPrank(alice);
  //   world.mc_SpawnSystem_spawn("Alice");
  //   vm.stopPrank();

  //   bytes32 aliceEntity = LibUtils.addressToEntityKey(alice);

  //   vm.startPrank(bob);
  //   world.mc_SpawnSystem_spawn("Bob");
  //   vm.stopPrank();

  //   bytes32 bobEntity = LibUtils.addressToEntityKey(bob);

  //   vm.roll(block.number + 5);

  //   // Connect Alice
  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   uint32 aliceInitialEnergy = Energy.get(world, aliceEntity);

  //   // FF 50 blocks ...
  //   vm.roll(block.number + 50);

  //   // Connect Bob
  //   vm.startPrank(bob);
  //   world.mc_ConnectSystem_connect(ConnectionType.RESOURCE, foodSourceEntity);
  //   vm.stopPrank();

  //   uint32 bobInitialEnergy = Energy.get(world, bobEntity);

  //   // Alice'S energy should be settled
  //   assertEq(Energy.get(world, aliceEntity), aliceInitialEnergy + 50);

  //   // FF 50 blocks ...
  //   vm.roll(block.number + 50);

  //   // Disconnect Alice
  //   vm.startPrank(alice);
  //   world.mc_ConnectSystem_disconnect(ConnectionType.RESOURCE);
  //   vm.stopPrank();

  //   // Alice's energy should be settled
  //   assertEq(Energy.get(world, aliceEntity), aliceInitialEnergy + 50 + 25);

  //   // Bob's energy should be settled
  //   assertEq(Energy.get(world, bobEntity), bobInitialEnergy + 25);

  //   // FF 50 blocks ...
  //   vm.roll(block.number + 50);

  //   // Disconnect Bob
  //   vm.startPrank(bob);
  //   world.mc_ConnectSystem_disconnect(ConnectionType.RESOURCE);
  //   vm.stopPrank();

  //   // Bob's energy should be settled
  //   assertEq(Energy.get(world, bobEntity), bobInitialEnergy + 25 + 50);
  // }
}
