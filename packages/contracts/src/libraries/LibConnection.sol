// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, CreationBlock, EntityType, ConnectionType, SourcePort, TargetPort, SourcePort, SourcePortTableId } from "../codegen/index.sol";
import { ENTITY_TYPE, CONNECTION_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibConnection {
  /**
   * @notice Creates a new connection entity.
   * @dev This function is internal and uses LibUtils to generate a random key for the connection entity.
   * @param _sourcePort The source port for the connection.
   * @param _targetPort The target port for the connection.
   * @param _connectionType The type of the connection as per the CONNECTION_TYPE enum.
   * @return Returns the random key generated for the connection entity.
   */
  function create(
    bytes32 _sourcePort,
    bytes32 _targetPort,
    CONNECTION_TYPE _connectionType
  ) internal returns (bytes32) {
    bytes32 connectionEntity = LibUtils.getRandomKey();
    CreationBlock.set(connectionEntity, block.number);
    EntityType.set(connectionEntity, ENTITY_TYPE.CONNECTION);
    ConnectionType.set(connectionEntity, _connectionType);
    SourcePort.set(connectionEntity, _sourcePort);
    TargetPort.set(connectionEntity, _targetPort);
    return connectionEntity;
  }

  /**
   * @notice Destroys a connection entity.
   * @dev This function removes all records associated with the given connection entity.
   * @param _connectionEntity The key of the connection entity to be destroyed.
   */
  function destroy(bytes32 _connectionEntity) internal {
    CreationBlock.deleteRecord(_connectionEntity);
    EntityType.deleteRecord(_connectionEntity);
    ConnectionType.deleteRecord(_connectionEntity);
    SourcePort.deleteRecord(_connectionEntity);
    TargetPort.deleteRecord(_connectionEntity);
  }

  function getOutgoing(bytes32 _portEntity) internal view returns (bytes32 connection) {
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.HasValue, SourcePortTableId, SourcePort.encodeStatic(_portEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }
}
