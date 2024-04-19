// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { MACHINE_TYPE } from "./../common.sol";

/**
 * @title IBuildSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IBuildSystem {
  function buildMachine(MACHINE_TYPE _machineType) external returns (bytes32 machineEntity);
}
