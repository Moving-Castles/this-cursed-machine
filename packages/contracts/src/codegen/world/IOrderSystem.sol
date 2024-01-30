// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { MATERIAL_TYPE } from "./../common.sol";

/**
 * @title IOrderSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IOrderSystem {
  function fill(bytes32 _storageEntity) external;

  function accept(bytes32 _orderEntity) external;

  function create(
    MATERIAL_TYPE _resourceMaterialType,
    uint32 _resourceAmount,
    MATERIAL_TYPE _goalMaterialType,
    uint32 _goalAmount,
    uint32 _reward,
    uint32 _duration,
    uint32 _maxPlayers
  ) external returns (bytes32);

  function cancel(bytes32 _orderEntity) external;
}
