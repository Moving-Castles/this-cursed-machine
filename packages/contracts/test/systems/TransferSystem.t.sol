// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, PORT_TYPE, CONNECTION_TYPE } from "../../src/codegen/Types.sol";

contract TransferSystemTest is MudV2Test {
  function testTransfer() public {
    setUp();

    vm.startPrank(alice);
    bytes32 spawnBoxEntity = world.mc_SpawnSystem_spawn("Alice");
    vm.stopPrank();

    bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

    assertEq(Level.get(world, coreEntity), 0);

    vm.startPrank(alice);
    bytes32 transferBoxEntity = world.mc_TransferSystem_transfer();
    vm.stopPrank();

    assertEq(Level.get(world, coreEntity), 1);

    assert(spawnBoxEntity != transferBoxEntity);
  }
}
