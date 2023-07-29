// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Position, Type, PositionData, PositionTableId, ReadyBlock, StartBlock, RealmId, Energy, ResourceConnection, ControlConnection, GameConfigData, GameConfig } from "../codegen/Tables.sol";
import { LibUtils, LibMap, LibEnergy } from "../libraries/Libraries.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";

contract PortalSystem is System {
  function charge(bytes32 _sourceEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(ResourceConnection.get(coreEntity) == _sourceEntity, "not connected");
    require(uint8(Type.get(_sourceEntity)) == uint8(EntityType.PORTAL), "not portal");

    LibEnergy.settleEnergy();
    require(Energy.get(coreEntity) >= 100, "not enough energy");

    Energy.set(coreEntity, Energy.get(coreEntity) - 100);
    Energy.set(_sourceEntity, Energy.get(_sourceEntity) + 100);
  }

  function exit(bytes32 _sourceEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(ControlConnection.get(coreEntity) == _sourceEntity, "not connected");
    require(Energy.get(_sourceEntity) >= 200, "not enough energy");

    LibEnergy.settleEnergy();

    Energy.set(_sourceEntity, Energy.get(_sourceEntity) - 200);
    Position.deleteRecord(coreEntity);
    ResourceConnection.deleteRecord(coreEntity);
    ControlConnection.deleteRecord(coreEntity);
    RealmId.set(coreEntity, 1);
  }
}
