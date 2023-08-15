// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { Name, ReadyBlock, EntityType, GameConfig, GameConfigData } from "../codegen/Tables.sol";
import { ENTITY_TYPE, CONNECTION_TYPE, PORT_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibConnection } from "../libraries/Libraries.sol";

contract ConnectionSystem is System {
  function connect(CONNECTION_TYPE _connectionType, bytes32 _sourcePort, bytes32 _targetPort) public returns (bytes32) {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // ...
    require(ReadyBlock.get(coreEntity) >= block.number, "core in cooldown");
    require(EntityType.get(_sourcePort) == ENTITY_TYPE.PORT, "source not port");
    require(EntityType.get(_targetPort) == ENTITY_TYPE.PORT, "target not port");
    require(_sourcePort != _targetPort, "source and target same");
    // Only resource connections supported for now...
    require(_connectionType == CONNECTION_TYPE.RESOURCE, "only resource");
    // TODO: check core is allowed to connect to ports (?)
    // ...

    // Create connection entity
    bytes32 connectionEntity = LibConnection.create(_sourcePort, _targetPort, _connectionType);

    return connectionEntity;
  }

  function disconnect(bytes32 _connectionEntity) public {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    // ...
    require(ReadyBlock.get(coreEntity) >= block.number, "core in cooldown");
    require(EntityType.get(_connectionEntity) == ENTITY_TYPE.CONNECTION, "not connection");
    // TODO: check core is allowed to disconnect (?)
    // ...

    // Destroy connection entity
    LibConnection.destroy(_connectionEntity);
  }
}
