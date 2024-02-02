// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { ENTITY_TYPE, MACHINE_TYPE, MATERIAL_TYPE } from "../../../src/codegen/common.sol";

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

contract SpawnSystemTest is BaseTest {
  using WorldResourceIdInstance for ResourceId;

  function testReward() public {
    setUp();

    address token = gameConfig.tokenAddress;
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _balancesTableId(systemId.getNamespace());

    vm.startPrank(alice);
    world.reward();
    vm.stopPrank();

    assertEq(Balances.get(tableId, worldAddress), 999000);
    assertEq(Balances.get(tableId, alice), 1000);
  }

  function testCharge() public {
    setUp();

    address token = gameConfig.tokenAddress;
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _balancesTableId(systemId.getNamespace());

    vm.startPrank(alice);
    world.reward();

    assertEq(Balances.get(tableId, worldAddress), 999000);
    assertEq(Balances.get(tableId, alice), 1000);

    world.charge();

    assertEq(Balances.get(tableId, worldAddress), 999100);
    assertEq(Balances.get(tableId, alice), 900);

    vm.stopPrank();
  }

  function testRevertInsufficientBalance() public {
    setUp();

    vm.startPrank(alice);

    vm.expectRevert("insufficient balance");
    world.charge();

    vm.stopPrank();
  }
}
