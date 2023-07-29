// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { MudV2Test } from "./MudV2Test.t.sol";
import "../src/codegen/Tables.sol";
import "../src/libraries/Libraries.sol";
import { moverEntity, resourceEntity, portalEntity } from "../src/constants.sol";
import { EntityType } from "../src/codegen/Types.sol";

contract DeployTest is MudV2Test {
  function testWorldExists() public {
    setUp();
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testMoverSpawn() public {
    setUp();
    assertEq(Position.get(world, moverEntity).x, 3);
    assertEq(Position.get(world, moverEntity).y, 3);
    assertEq(uint8(Type.get(world, moverEntity)), uint8(EntityType.MOVER));
  }

  function testResourceSpawn() public {
    setUp();
    assertEq(Position.get(world, resourceEntity).x, 3);
    assertEq(Position.get(world, resourceEntity).y, 0);
    assertEq(uint8(Type.get(world, resourceEntity)), uint8(EntityType.RESOURCE));
  }

  function testPortalSpawn() public {
    setUp();
    assertEq(Position.get(world, portalEntity).x, 3);
    assertEq(Position.get(world, portalEntity).y, 6);
    assertEq(uint8(Type.get(world, portalEntity)), uint8(EntityType.PORTAL));
  }
}
