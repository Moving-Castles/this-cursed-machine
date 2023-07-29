// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "forge-std/Test.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import "../src/codegen/Tables.sol";

contract MudV2Test is Test {
  address worldAddress;
  IWorld world;

  GameConfigData gameConfig;

  address internal alice;
  address internal bob;
  address internal eve;
  address internal mallory;
  address internal xavier;

  function setUp() public virtual {
    worldAddress = vm.parseAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    world = IWorld(worldAddress);
    gameConfig = GameConfig.get(world);

    alice = address(111);
    bob = address(222);
    eve = address(333);
    mallory = address(444);
    xavier = address(555);
  }
}
