// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { MudV2Test } from "../MudV2Test.t.sol";
import "../../src/codegen/Tables.sol";
import "../../src/libraries/Libraries.sol";
import { EntityType } from "../../src/codegen/Types.sol";

contract SpawnSystemTest is MudV2Test {
    function testBuilOrgan() public {
        setUp();

        vm.startPrank(alice);
        world.mc_SpawnSystem_spawn("Alice");
        vm.stopPrank();

        bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

        vm.roll(block.number + 5);

        vm.startPrank(alice);
        bytes32 resourceEntity = world.mc_BuildSystem_buildOrgan(EntityType.RESOURCE, 0, 1);
        vm.stopPrank();

        assertEq(Energy.get(world, coreEntity), gameConfig.coreInitialEnergy - gameConfig.buildCost);

        assertEq(uint8(Type.get(world, resourceEntity)), uint8(EntityType.RESOURCE));
    }

    function testRevertOccupied() public {
        setUp();

        vm.startPrank(alice);
        world.mc_SpawnSystem_spawn("Alice");
        vm.stopPrank();

        bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

        vm.roll(block.number + 5);

        vm.startPrank(alice);
        vm.expectRevert("occupied");
        world.mc_BuildSystem_buildOrgan(EntityType.RESOURCE, 0, 0);
        vm.stopPrank();
    }

    function testRevertInvalidEntityType() public {
        setUp();

        vm.startPrank(alice);
        world.mc_SpawnSystem_spawn("Alice");
        vm.stopPrank();

        bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

        vm.roll(block.number + 5);

        vm.startPrank(alice);
        vm.expectRevert("invalid entity type");
        world.mc_BuildSystem_buildOrgan(EntityType.CORE, 0, 1);
        vm.stopPrank();
    }

    function testBuildConnection() public {
        setUp();

        vm.startPrank(alice);
        world.mc_SpawnSystem_spawn("Alice");
        vm.stopPrank();

        bytes32 coreEntity = LibUtils.addressToEntityKey(alice);

        vm.roll(block.number + 5);

        vm.startPrank(alice);
        bytes32 resourceEntity = world.mc_BuildSystem_buildOrgan(EntityType.RESOURCE, 0, 1);
        vm.stopPrank();

        assertEq(Energy.get(world, coreEntity), gameConfig.coreInitialEnergy - gameConfig.buildCost);


        vm.roll(block.number + 5);

        vm.startPrank(alice);
        bytes32 connectionEntity = world.mc_BuildSystem_buildConnection(EntityType.RESOURCE_CONNECTION, coreEntity, resourceEntity);
        vm.stopPrank();

        assertEq(uint8(Type.get(world, connectionEntity)), uint8(EntityType.RESOURCE_CONNECTION));
        assertEq(SourceEntity.get(world, connectionEntity), coreEntity);
        assertEq(TargetEntity.get(world, connectionEntity), resourceEntity);
    }
}
