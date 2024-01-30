// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.21;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

contract SpawnSystemTest is BaseTest {
  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    vm.stopPrank();

    // Check that the player was spawned correctly
    assertEq(uint8(EntityType.get(playerEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(uint8(MachineType.get(playerEntity)), uint8(MACHINE_TYPE.PLAYER));
    assertEq(TutorialLevel.get(playerEntity), 0);
    assertEq(SpawnIndex.get(playerEntity), 1);
    assertEq(CreationBlock.get(playerEntity), block.number);
    assertEq(IncomingConnections.get(playerEntity).length, 1);
    assertEq(OutgoingConnections.get(playerEntity).length, 2);
  }

  function testSpawnAndStart() public {
    setUp();

    vm.startPrank(alice);
    bytes32 playerEntity = world.spawn();
    bytes32 podEntity = world.start();
    vm.stopPrank();

    assertEq(CarriedBy.get(playerEntity), podEntity);
    assertEq(TutorialLevel.get(playerEntity), 0);
    assertEq(CurrentOrder.get(podEntity), TutorialOrders.get()[0]);
    assertEq(
      uint32(MaterialType.get(DispenserEntity.get(podEntity))),
      uint32(MaterialType.get(ResourceEntity.get(TutorialOrders.get()[0])))
    );
    assertEq(Amount.get(DispenserEntity.get(podEntity)), Amount.get(ResourceEntity.get(TutorialOrders.get()[0])));
  }
}
