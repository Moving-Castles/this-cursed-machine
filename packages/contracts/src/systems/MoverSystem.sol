// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position, Type, PositionData, PositionTableId, ReadyBlock, StartBlock, RealmId, Energy, ResourceConnection, ControlConnection, GameConfigData, GameConfig } from "../codegen/Tables.sol";
import { LibUtils, LibMap, LibEnergy } from "../libraries/Libraries.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";

contract MoverSystem is System {
  function charge(bytes32 _sourceEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(Type.get(_sourceEntity) == EntityType.MOVER, "not mover");
    require(ResourceConnection.get(coreEntity) == _sourceEntity, "not connected");

    LibEnergy.settleEnergy();
    require(Energy.get(coreEntity) >= 20, "not enough energy");

    Energy.set(coreEntity, Energy.get(coreEntity) - 20);
    Energy.set(_sourceEntity, Energy.get(_sourceEntity) + 20);
  }

  function move(bytes32 _sourceEntity, bytes32 _targetEntity, int32 x, int32 y) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(ControlConnection.get(coreEntity) == _sourceEntity, "not connected");
    require(Type.get(_sourceEntity) == EntityType.MOVER, "not mover");
    require(Energy.get(_sourceEntity) >= 20, "not enough energy");
    require(LibMap.getEntityAtPosition(PositionData({ x: x, y: y })) == 0, "position occupied");

    LibEnergy.settleEnergy();

    Energy.set(_sourceEntity, Energy.get(_sourceEntity) - 20);
    Position.set(_targetEntity, PositionData({ x: x, y: y }));
  }
}
