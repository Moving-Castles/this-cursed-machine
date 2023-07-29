// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";

contract DevSystem is System {
  function set(bytes32 _tableId, bytes32 _entity, bytes memory value) public {
    bytes32[] memory key = new bytes32[](1);
    key[0] = _entity;
    StoreSwitch.setField(_tableId, key, 0, value);
  }

  function set(bytes32 _tableId, bytes32 _entity, int32 x, int32 y) public {
    bytes32[] memory key = new bytes32[](1);
    key[0] = _entity;
    StoreSwitch.setField(_tableId, key, 0, abi.encodePacked(x));
    StoreSwitch.setField(_tableId, key, 1, abi.encodePacked(y));
  }
}
