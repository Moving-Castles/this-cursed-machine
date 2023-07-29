// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { Position, Type, PositionData, PositionTableId, ReadyBlock, StartBlock, RealmId, RealmIdTableId, Energy, ResourceConnection, ControlConnection, GameConfigData, GameConfig} from "../codegen/Tables.sol";
import { LibUtils, LibMap, LibEnergy } from "../libraries/Libraries.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";

contract CSplitSystem is System {
  function connect(bytes32 _sourceOrgan, bytes32 _targetOrgan) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    GameConfigData memory gameConfig = GameConfig.get();
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(ControlConnection.get(coreEntity) == _sourceOrgan, "not connected");
    require(LibMap.getConnections(ConnectionType.CONTROL, _targetOrgan).length == 0, "fully connected");

    LibEnergy.settleEnergy();

    uint32 distance = LibMap.manhattanDistance(Position.get(_sourceOrgan), Position.get(_targetOrgan));
    uint32 cost = distance * gameConfig.resourceConnectionCost;
    require(Energy.get(coreEntity) >= cost, "not enough energy");

    ControlConnection.set(_sourceOrgan, _targetOrgan);
    Energy.set(coreEntity, Energy.get(coreEntity) - cost);
  }

  function disconnect(bytes32 _sourceOrgan) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(RealmId.get(coreEntity) == 0, "not in realm");
    require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
    require(ControlConnection.get(coreEntity) == _sourceOrgan, "not connected");

    LibEnergy.settleEnergy();

    ControlConnection.deleteRecord(_sourceOrgan);
  }

  // function vote(bytes32 _sourceOrgan, bytes32 _targetOrgan) public {
  //   bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
  //   require(RealmId.get(coreEntity) == 0, "not in realm");
  //   require(ReadyBlock.get(coreEntity) < block.number, "in cooldown");
  //   require(ControlConnection.get(coreEntity) == _sourceOrgan, "not connected");
  //   require(Type.get(ControlConnection.get(_sourceOrgan)) == EntityType.COUNTER, "not connected to counter");

  //   LibEnergy.settleEnergy();
  //   Voted.set(coreEntity, true);
  //   // Return if not all voted
  //   bytes32[] memory coresInRealm = getKeysWithValue(RealmIdTableId, RealmId.encode(0));
  //   for (uint i = 0; i < coresInRealm.length; i++) {
  //     if (Voted.get(coresInRealm[i]) == false) {
  //       return;
  //     }
  //   }
  //   // If yes:
  //   // – Increment counter
  //   Counter.set(_targetOrgan, Counter.get(_targetOrgan) + 1);
  //   // - reset voted for all
  //   for (uint x = 0; x < coresInRealm.length; x++) {
  //     Voted.set(coresInRealm[x], false);
  //   }
  // }
}
