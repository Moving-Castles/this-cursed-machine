// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { PORT_INDEX } from "./../common.sol";

/**
 * @title IConnectSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IConnectSystem {
  function connect(bytes32 _sourceMachine, bytes32 _targetMachine, PORT_INDEX _portIndex) external;
}
