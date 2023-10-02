// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { IWorld } from "../codegen/world/IWorld.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { PortType, CarriedBy, CarriedByTableId, EntityType, EntityTypeTableId, PortType, PortTypeTableId, PortPlacement, CreationBlock } from "../codegen/index.sol";
import { ENTITY_TYPE, PORT_TYPE, PORT_PLACEMENT } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";

library LibPort {
  /**
   * @dev Creates a new port entity with specified attributes, associates it with a core entity, and sets its placement.
   *
   * The function generates a unique key for the port entity, assigns it the "PORT" entity type, and sets its type and placement.
   * The placements can be one of the following: "TOP", "RIGHT", "BOTTOM", or "LEFT".
   *
   * @param _hostEntity The bytes32 key associated with the entity to which the port will be linked.
   * @param _portType The type of the port to be created.
   * @param _portPlacement The specific placement of the port, which can be "TOP", "RIGHT", "BOTTOM", or "LEFT".
   *
   * @return Returns the generated key associated with the newly created port entity.
   */
  function create(bytes32 _hostEntity, PORT_TYPE _portType, PORT_PLACEMENT _portPlacement) internal returns (bytes32) {
    bytes32 portEntity = LibUtils.getRandomKey();
    EntityType.set(portEntity, ENTITY_TYPE.PORT);
    CreationBlock.set(portEntity, block.number);
    PortType.set(portEntity, _portType);
    PortPlacement.set(portEntity, _portPlacement);
    CarriedBy.set(portEntity, _hostEntity);
    return portEntity;
  }

  /**
   * @notice Destroys a port entity.
   * @dev This function removes all records associated with the given port entity. It should be used with caution to ensure data integrity.
   * @param _portEntity The key of the port entity to be destroyed.
   */
  function destroy(bytes32 _portEntity) internal {
    EntityType.deleteRecord(_portEntity);
    CreationBlock.deleteRecord(_portEntity);
    PortType.deleteRecord(_portEntity);
    PortPlacement.deleteRecord(_portEntity);
    CarriedBy.deleteRecord(_portEntity);
  }

  /**
   * @notice Retrieves the ports of a given entity and port type.
   * @param _entity The entity identifier for which to retrieve ports.
   * @param _portType The type of port to be retrieved.
   * @return ports A 2D array of byte32 representing the ports of the given entity and port type.
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
   * @notice Retrieves the ports of a given entity and port type in a specific world.
   * @param _world The world context in which to perform the query.
   * @param _entity The entity identifier for which to retrieve ports.
   * @param _portType The type of port to be retrieved.
   * @return ports A 2D array of byte32 representing the ports of the given entity and port type in the specified world.
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
