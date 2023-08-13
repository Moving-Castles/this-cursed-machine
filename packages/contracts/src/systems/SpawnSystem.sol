// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, ClaimBlock, CreationBlock, Active, Width, Height, Level, MinCores, MaxCores, EntityType, Position, PositionData, CarriedBy, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibMap } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn(string memory _name) public returns (bytes32){
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // TODO: check if already spawned

    // Create box entity
    bytes32 boxEntity = LibUtils.getRandomKey();
    EntityType.set(boxEntity, ENTITY_TYPE.BOX);
    Level.set(boxEntity, 0);
    Width.set(boxEntity, 4);
    Height.set(boxEntity, 4);
    MinCores.set(boxEntity, 1);
    MaxCores.set(boxEntity, 2);
    CreationBlock.set(boxEntity, block.number);
    Active.set(boxEntity, true);

    // Create core entity
    EntityType.set(coreEntity, ENTITY_TYPE.CORE);
    Name.set(coreEntity, _name);
    CreationBlock.set(coreEntity, block.number);
    ReadyBlock.set(coreEntity, block.number);
    Position.set(coreEntity,  PositionData(2, 1));
    CarriedBy.set(coreEntity, boxEntity);
    Level.set(coreEntity, 0);

    // TODO: create ports on core entity

    return boxEntity;
  }
}
