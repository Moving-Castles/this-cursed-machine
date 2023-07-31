// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { MudV2Test } from "./MudV2Test.t.sol";
import "../src/codegen/Tables.sol";
import "../src/libraries/Libraries.sol";
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

}
