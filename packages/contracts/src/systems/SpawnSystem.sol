// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, StartBlock, Type, Energy, Position, RealmId, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { EntityType } from "../codegen/Types.sol";
import { LibUtils, LibMap } from "../libraries/Libraries.sol";

contract SpawnSystem is System {
  function spawn(string memory _name) public {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // ...
    Type.set(coreEntity, EntityType.CORE);
    Name.set(coreEntity, _name);
    RealmId.set(coreEntity, 0);
    Energy.set(coreEntity, gameConfig.coreInitialEnergy);
    ReadyBlock.set(coreEntity, block.number);
    Position.set(coreEntity, LibMap.selectSpawnPosition());
  }
}
