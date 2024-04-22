// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../../../src/codegen/common.sol";

contract SpawnSystemTest is BaseTest {
  function testSpawn() public {
    setUp();

    vm.startPrank(alice);
    startGasReport("Spawn");
    bytes32 playerEntity = world.spawn("alice");
    endGasReport();
    vm.stopPrank();

    // Check that the player was spawned correctly
    assertEq(uint8(EntityType.get(playerEntity)), uint8(ENTITY_TYPE.MACHINE));
    assertEq(uint8(MachineType.get(playerEntity)), uint8(MACHINE_TYPE.PLAYER));
    assertEq(TutorialLevel.get(playerEntity), 0);
    assertEq(SpawnIndex.get(playerEntity), 1);
    assertEq(IncomingConnections.get(playerEntity).length, 1);
    assertEq(OutgoingConnections.get(playerEntity).length, 2);
  }
}
