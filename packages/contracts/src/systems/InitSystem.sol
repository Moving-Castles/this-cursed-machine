// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, EntityType } from "../codegen/index.sol";
import { LibLevel, LibUtils, LibGoal } from "../libraries/Libraries.sol";
import { LevelDefinition, WAREHOUSE_KEY } from "../constants.sol";
import { MATERIAL_TYPE, ENTITY_TYPE } from "../codegen/common.sol";

contract InitSystem is System {
  /**
   * @notice Initializes the game configuration and creates initial level definitions.
   * @dev Ensure that the system is not initialized more than once by checking the 'coolDown' in GameConfig.
   */
  function init(address tokenAddress) public {
    require(GameConfig.get().coolDown == 0, "InitSystem: already initialized");

    // Set game config
    GameConfig.set(
      GameConfigData({ coolDown: 1, connectionCost: 0, buildCost: 0, tokenAddress: tokenAddress, globalSpawnIndex: 0 })
    );

    // Create warehouse
    bytes32 warehouseEntity = LibUtils.getRandomKey();
    EntityType.set(warehouseEntity, ENTITY_TYPE.WAREHOUSE);

    // Create levels
    LevelDefinition[2] memory levels = [LevelDefinition({ level: 1 }), LevelDefinition({ level: 2 })];

    for (uint256 i = 0; i < levels.length; i++) {
      LibLevel.create(levels[i]);
    }

    // Create goals for levels
    LibGoal.create(1, MATERIAL_TYPE.PISS, 1000);
    // ** 2
    LibGoal.create(2, MATERIAL_TYPE.BLOOD, 1000);
  }
}
