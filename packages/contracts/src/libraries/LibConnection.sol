// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, EntityType, TargetPort, SourcePort, SourcePortTableId } from "../codegen/index.sol";
import { ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibConnection {
  /**
   * @notice Creates a new connection entity.
   * @dev This function is internal and uses LibUtils to generate a random key for the connection entity.
   * @param _sourcePort The source port for the connection.
   * @param _targetPort The target port for the connection.
   * @return Returns the random key generated for the connection entity.
   */
  function create(bytes32 _sourcePort, bytes32 _targetPort) internal returns (bytes32) {
    bytes32 connectionEntity = LibUtils.getRandomKey();
    EntityType.set(connectionEntity, ENTITY_TYPE.CONNECTION);
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
    EntityType.deleteRecord(_connectionEntity);
    SourcePort.deleteRecord(_connectionEntity);
    TargetPort.deleteRecord(_connectionEntity);
  }

  /**
   * @notice Retrieves the outgoing connection from a specified port entity.
   * @param _portEntity The identifier of the port entity to query.
   * @return connection The identifier of the outgoing connection, or a zero bytes32 if none.
   */
  function getOutgoing(bytes32 _portEntity) internal view returns (bytes32 connection) {
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.HasValue, SourcePortTableId, SourcePort.encodeStatic(_portEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }
}
