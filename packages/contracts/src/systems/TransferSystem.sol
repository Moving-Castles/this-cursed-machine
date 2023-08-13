// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, ClaimBlock, CreationBlock, Level, Active, MinCores, MaxCores, EntityType, Height, Width, Position, PositionData, CarriedBy, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibMap, LibBox } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  function transfer() public {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    uint32 newLevel = Level.get(coreEntity) + 1;

    if(newLevel == 5) {
      // Get all level 5 boxes
      bytes32[][] memory levelFiveBoxes = LibBox.getInactiveBoxesByLevel(5);
      console.log('levelFiveBoxes.length');
      console.log(levelFiveBoxes.length);
      // Check if any are inactive
      if(levelFiveBoxes.length > 0) {
        // Join existing box
        bytes32 boxEntity = levelFiveBoxes[0][0];
        CarriedBy.set(coreEntity, boxEntity);
        Level.set(coreEntity, newLevel);
        Active.set(boxEntity, true);
      } else {
        // Create box entity
        bytes32 boxEntity = LibUtils.getRandomKey();
        EntityType.set(boxEntity, ENTITY_TYPE.BOX);
        Level.set(boxEntity, newLevel);
        Width.set(boxEntity, 4);
        Height.set(boxEntity, 4);
        CreationBlock.set(boxEntity, block.number);
        MinCores.set(boxEntity, 2);
        MaxCores.set(boxEntity, 2);
        Active.set(boxEntity, false);
        // Level up core entity
        CarriedBy.set(coreEntity, boxEntity);
        Level.set(coreEntity, newLevel);
      }
    } else {
      // Create box entity
      bytes32 boxEntity = LibUtils.getRandomKey();
      EntityType.set(boxEntity, ENTITY_TYPE.BOX);
      Level.set(boxEntity, newLevel);
      Width.set(boxEntity, 4);
      Height.set(boxEntity, 4);
      CreationBlock.set(boxEntity, block.number);
      Active.set(boxEntity, true);
      MinCores.set(boxEntity, 1);
      MaxCores.set(boxEntity, 1);
      // Level up core entity
      CarriedBy.set(coreEntity, boxEntity);
      Level.set(coreEntity, newLevel);
    }

    // TODO: create ports on core entity
    // TODO: destroy old box
    // ...
  }
}
