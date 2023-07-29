// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position, Type, PositionData, PositionTableId, ReadyBlock, StartBlock, RealmId, Energy, ResourceConnection, ControlConnection, GameConfigData, GameConfig } from "../codegen/Tables.sol";
import { LibUtils, LibMap, LibEnergy } from "../libraries/Libraries.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";

contract ConnectSystem is System {
  function connect(ConnectionType connectionType, bytes32 _organEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    GameConfigData memory gameConfig = GameConfig.get();
    uint32 distance = LibMap.manhattanDistance(Position.get(coreEntity), Position.get(_organEntity));

    LibEnergy.settleEnergy();

    if (connectionType == ConnectionType.RESOURCE) {
      require(ResourceConnection.get(coreEntity) == 0, "core committed");
      // Except for R-split, only allow one control connection per organ
      // if (Type.get(_organEntity) != EntityType.RESOURCE_SPLIT) {
      //   require(LibMap.getConnections(ConnectionType.RESOURCE, _organEntity).length == 0, "fully connected");
      // }
      uint32 cost = distance * gameConfig.resourceConnectionCost;
      require(Energy.get(coreEntity) >= cost, "not enough energy");
      // ...
      ResourceConnection.set(coreEntity, _organEntity);
      Energy.set(coreEntity, Energy.get(coreEntity) - cost);
      // If we are connecting to a food source, 
      // or the r-split connected to a food source
      // or the modifier connected to a food source
      if (Type.get(_organEntity) == EntityType.RESOURCE)
      {
        StartBlock.set(coreEntity, block.number);
      }
    } else if (connectionType == ConnectionType.CONTROL) {
      require(ControlConnection.get(coreEntity) == 0, "core committed");
      // Except for C-split, only allow one control connection per organ
      if (Type.get(_organEntity) != EntityType.CONTROL_SPLIT) {
        require(LibMap.getConnections(ConnectionType.CONTROL, _organEntity).length == 0, "fully connected");
      }
      uint32 cost = distance * gameConfig.controlConnectionCost;
      require(Energy.get(coreEntity) >= cost, "not enough energy");
      ControlConnection.set(coreEntity, _organEntity);
      Energy.set(coreEntity, Energy.get(coreEntity) - cost);
    }
  }

  function disconnect(ConnectionType connectionType) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");

    LibEnergy.settleEnergy();

    bytes32 organEntity = ResourceConnection.get(coreEntity);

    if (connectionType == ConnectionType.RESOURCE) {
      if (Type.get(organEntity) == EntityType.RESOURCE) {
        StartBlock.deleteRecord(coreEntity);
      }
      // ...
      ResourceConnection.deleteRecord(coreEntity);
    } else if (connectionType == ConnectionType.CONTROL) {
      ControlConnection.deleteRecord(coreEntity);
    }
  }

  function settle() public {
    LibEnergy.settleEnergy();
  }
}
