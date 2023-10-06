// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { IWorld } from "../codegen/world/IWorld.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { PortType, CarriedBy, CarriedByTableId, EntityType, EntityTypeTableId, PortType, PortTypeTableId, CreationBlock } from "../codegen/index.sol";
import { ENTITY_TYPE, PORT_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibPort {
  /**
   * @notice Creates a new port entity with specified type and placement and associates it with a host entity.
   * @param _hostEntity The identifier of the host entity to which the port is associated.
   * @param _portType The type of the port, specified by the PORT_TYPE enum.
   * @return portEntity The identifier for the newly created port entity.
   */
  function create(bytes32 _hostEntity, PORT_TYPE _portType) internal returns (bytes32) {
    bytes32 portEntity = LibUtils.getRandomKey();
    EntityType.set(portEntity, ENTITY_TYPE.PORT);
    CreationBlock.set(portEntity, block.number);
    PortType.set(portEntity, _portType);
    CarriedBy.set(portEntity, _hostEntity);
    return portEntity;
  }

  /**
   * @notice Deletes the records related to a specified port entity.
   * @param _portEntity The identifier for the port entity whose records are to be deleted.
   */
  function destroy(bytes32 _portEntity) internal {
    EntityType.deleteRecord(_portEntity);
    CreationBlock.deleteRecord(_portEntity);
    PortType.deleteRecord(_portEntity);
    CarriedBy.deleteRecord(_portEntity);
  }

  /**
   * @notice Retrieves ports of a specific type associated with a given entity.
   * @param _entity The identifier of the entity to retrieve ports for.
   * @param _portType The type of port to retrieve, specified by the PORT_TYPE enum.
   * @return ports A dynamic 2D bytes32 array containing identifiers of the retrieved ports.
   */
  function getPorts(bytes32 _entity, PORT_TYPE _portType) internal view returns (bytes32[][] memory ports) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.PORT));
    fragments[1] = QueryFragment(QueryType.HasValue, PortTypeTableId, PortType.encodeStatic(_portType));
    fragments[2] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_entity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * @notice Retrieves ports of a specified type associated with a given entity in the provided world.
   * @param _world The world context in which to perform the query.
   * @param _entity The identifier of the entity to retrieve ports for.
   * @param _portType The type of port to retrieve, specified by the PORT_TYPE enum.
   * @return ports A dynamic 2D bytes32 array containing identifiers of the retrieved ports.
   */
  function getPorts(
    IWorld _world,
    bytes32 _entity,
    PORT_TYPE _portType
  ) internal view returns (bytes32[][] memory ports) {
    QueryFragment[] memory fragments = new QueryFragment[](3);
    fragments[0] = QueryFragment(QueryType.HasValue, EntityTypeTableId, EntityType.encodeStatic(ENTITY_TYPE.PORT));
    fragments[1] = QueryFragment(QueryType.HasValue, PortTypeTableId, PortType.encodeStatic(_portType));
    fragments[2] = QueryFragment(QueryType.HasValue, CarriedByTableId, CarriedBy.encodeStatic(_entity));
    bytes32[][] memory keyTuples = query(_world, fragments);
    return keyTuples;
  }
}
