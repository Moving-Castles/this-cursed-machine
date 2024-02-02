// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "./BaseTest.sol";
import "../src/codegen/index.sol";
import "../src/libraries/Libraries.sol";

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";

import { MATERIAL_TYPE } from "../src/codegen/common.sol";

contract DeployTest is BaseTest {
  using WorldResourceIdInstance for ResourceId;

  function testWorldExists() public {
    setUp();
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testWorldInit() public {
    assertEq(TutorialOrders.get().length, 7);
    assertEq(uint32(Order.get(TutorialOrders.get()[0]).resourceMaterialType), uint32(MATERIAL_TYPE.BUG));
  }

  // function testPoolMint() public {
  //   address token = gameConfig.tokenAddress;
  //   ResourceId systemId = Puppet(token).systemId();
  //   ResourceId tableId = _balancesTableId(systemId.getNamespace());

  //   assertEq(Balances.get(tableId, worldAddress), 1000000);
  //   assertEq(IERC20Mintable(token).totalSupply(), 1000000);
  // }
}
