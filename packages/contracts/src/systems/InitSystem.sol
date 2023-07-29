// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData } from "../codegen/tables/GameConfig.sol";
import { Type, Position, PositionData, Energy, ReadyBlock, Name } from "../codegen/Tables.sol";
import { EntityType } from "../codegen/Types.sol";
import { moverEntity, resourceEntity, portalEntity } from "../constants.sol";

import { LibUtils, LibMap } from "../libraries/Libraries.sol";

contract InitSystem is System {
  function init() public {
    require(GameConfig.get().worldHeight == 0, "InitSystem: already initialized");
    GameConfig.set(
      GameConfigData({
        worldHeight: 7,
        worldWidth: 7,
        coolDown: 5,
        coreEnergyCap: 300,
        coreCrystallizedSludgeCap: 100,
        coreInitialEnergy: 100,
        resourceConnectionCost: 10,
        controlConnectionCost: 20,
        controlSplitCost: 25,
        converterCost: 25
      })
    );
    // Create mover
    Type.set(moverEntity, EntityType.MOVER);
    Name.set(moverEntity, "Claw");
    Energy.set(moverEntity, 0);
    Position.set(moverEntity, PositionData({ x: 3, y: 3 }));
    // Create resource
    Type.set(resourceEntity, EntityType.RESOURCE);
    Name.set(resourceEntity, "Sludge hole");
    Position.set(resourceEntity, PositionData({ x: 3, y: 0 }));
    // Create portal
    Type.set(portalEntity, EntityType.PORTAL);
    Name.set(portalEntity, "Exit hole");
    Energy.set(portalEntity, 0);
    Position.set(portalEntity, PositionData({ x: 3, y: 6 }));
  }
}
