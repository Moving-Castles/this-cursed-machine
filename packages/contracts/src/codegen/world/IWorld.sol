// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";

import { IBuildSystem } from "./IBuildSystem.sol";
import { IConnectSystem } from "./IConnectSystem.sol";
import { IDestroySystem } from "./IDestroySystem.sol";
import { IDisconnectSystem } from "./IDisconnectSystem.sol";
import { IInit2System } from "./IInit2System.sol";
import { IInitSystem } from "./IInitSystem.sol";
import { INameSystem } from "./INameSystem.sol";
import { IResolveSystem } from "./IResolveSystem.sol";
import { IRestartSystem } from "./IRestartSystem.sol";
import { ISpawnSystem } from "./ISpawnSystem.sol";
import { ITransferSystem } from "./ITransferSystem.sol";

/**
 * @title IWorld
 * @notice This interface integrates all systems and associated function selectors
 * that are dynamically registered in the World during deployment.
 * @dev This is an autogenerated file; do not edit manually.
 */
interface IWorld is
  IBaseWorld,
  IBuildSystem,
  IConnectSystem,
  IDestroySystem,
  IDisconnectSystem,
  IInit2System,
  IInitSystem,
  INameSystem,
  IResolveSystem,
  IRestartSystem,
  ISpawnSystem,
  ITransferSystem
{

}
