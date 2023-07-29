// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Position, PositionTableId, PositionData, Type, TypeTableId, ResourceConnection, ResourceConnectionTableId, ControlConnectionTableId, StartBlockTableId } from "../codegen/Tables.sol";
import { EntityType, ConnectionType } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibMap {
  /**
   * Calculate manhattan distance
   * https://en.wikipedia.org/wiki/Taxicab_geometry
   *
   * @param _A Coordinate A
   * @param _B Coordinate B
   * @return distance
   */

  function manhattanDistance(PositionData memory _A, PositionData memory _B) internal pure returns (uint32 distance) {
    // // Calculating the absolute difference in x coordinates
    // int32 xDifference = _A.x > _B.x ? _A.x - _B.x : _B.x - _A.x;

    // // Calculating the absolute difference in y coordinates
    // int32 yDifference = _A.y > _B.y ? _A.y - _B.y : _B.y - _A.y;

    // // Returning the sum of the differences
    // return xDifference + yDifference;

    return LibUtils.absDif(_A.x, _B.x) + LibUtils.absDif(_A.y, _B.y);
  }

  /**
   * Calculate chebyshev distance
   * https://en.wikipedia.org/wiki/Chebyshev_distance
   *
   * @param _A Coordinate A
   * @param _B Coordinate B
   * @return distance
   */
  function chebyshevDistance(PositionData memory _A, PositionData memory _B) internal pure returns (int32 distance) {
    return LibUtils.max(LibUtils.abs(_A.x - _B.x), LibUtils.abs(_A.y - _B.y));
  }

  /**
   * Check if two coordinates are adjacent
   *
   * @param _A Coordinate A
   * @param _B Coordinate B
   * @return adjacent bool
   */
  function isAdjacent(PositionData memory _A, PositionData memory _B) internal pure returns (bool adjacent) {
    int32 distance = chebyshevDistance(_A, _B);
    if (distance == 0 || distance == 1) return true;
    return false;
  }

  /**
   * Check if within the bounds of the world
   *
   * @param _coordinates position
   * @return withinBounds bool
   */
  function isWithinBounds(PositionData memory _coordinates) internal view returns (bool withinBounds) {
    GameConfigData memory gameConfig = GameConfig.get();
    if (_coordinates.x < 0) return false;
    if (_coordinates.x > gameConfig.worldWidth - 1) return false;
    if (_coordinates.y < 0) return false;
    if (_coordinates.y > gameConfig.worldHeight - 1) return false;
    return true;
  }

  /**
   * Generates random coordinates, within the bounds of the world
   *
   * @return position random coordinates
   */
  function randomCoordinates() internal view returns (PositionData memory position) {
    GameConfigData memory gameConfig = GameConfig.get();

    int32 x = int32(int256(LibUtils.random(666, block.timestamp)) % gameConfig.worldWidth);
    int32 y = int32(int256(LibUtils.random(block.timestamp, block.number)) % gameConfig.worldHeight);

    // Make sure the values are positive
    if (x < 0) x *= -1;
    if (y < 0) y *= -1;

    return PositionData(x, y);
  }

  /**
   * Find a valid spawn location
   *
   * @return position spawn position
   */
  function getSpawnPosition() internal view returns (PositionData memory position) {
    // We try max 20 times...
    uint256 i;
    do {
      PositionData memory spawnPosition = randomCoordinates();
      // Has to be traversable
      if (getCoreAtPosition(spawnPosition) == 0) {
        return spawnPosition;
      }
      unchecked {
        i++;
      }
    } while (i < 20);
    // @hack: should check conclusively if there is an open spawn position above, and deny spawn if not
    return PositionData(2, 4);
  }

  /**
   * Find a valid spawn location from list
   *
   * @return position spawn position
   */
  function selectSpawnPosition() internal view returns (PositionData memory position) {
    PositionData[4] memory spawnPositions = [
      PositionData(0, 0),
      PositionData(6, 0),
      PositionData(0, 6),
      PositionData(6, 6)
    ];
    for (uint256 i = 0; i < spawnPositions.length; i++) {
      if (getEntityAtPosition(spawnPositions[i]) == 0) {
        return spawnPositions[i];
      }
    }
    // TODO: deny spawn if body is full, but for now...
    return PositionData(1, 1);
  }

  /**
   * Check if position is untraversable
   *
   * @param _coordinates position
   * @return untraversable  is untraversable?
   */
  function isUntraversable(PositionData memory _coordinates) internal view returns (bool untraversable) {
    return false;
  }

  /**
   * Get next step for game master
   *
   * @param _current Game master position
   * @param _target  Core position
   * @return nextPosition  next position
   */
  function getNextStep(
    PositionData memory _current,
    PositionData memory _target
  ) internal pure returns (PositionData memory nextPosition) {
    if (_current.x < _target.x) {
      _current.x++;
    } else if (_current.x > _target.x) {
      _current.x--;
    }

    if (_current.y < _target.y) {
      _current.y++;
    } else if (_current.y > _target.y) {
      _current.y--;
    }

    return _current;
  }

  /**
   * Get core at position
   * @param _position position
   * @return coreId coreId
   */
  function getCoreAtPosition(PositionData memory _position) internal view returns (bytes32 coreId) {
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(
      QueryType.HasValue,
      PositionTableId,
      Position.encode({ x: _position.x, y: _position.y })
    );
    fragments[0] = QueryFragment(QueryType.HasValue, TypeTableId, Type.encode(EntityType.CORE));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }

  /**
   * Get core at position
   * @param _position position
   * @return entityId entityId
   */
  function getEntityAtPosition(PositionData memory _position) internal view returns (bytes32 entityId) {
    console.log("=> getEntityAtPosition");

    console.log("alice x");
    console.logInt(Position.get(LibUtils.addressToEntityKey(address(111))).x);
    console.log("alice y");
    console.logInt(Position.get(LibUtils.addressToEntityKey(address(111))).y);

    console.log("Query: _position.x");
    console.logInt(_position.x);
    console.log("Query: _position.y");
    console.logInt(_position.y);

    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(
      QueryType.HasValue,
      PositionTableId,
      Position.encode({ x: _position.x, y: _position.y })
    );
    bytes32[][] memory keyTuples = query(fragments);
    console.log("keyTuples.length");
    console.log(keyTuples.length);
    return keyTuples.length > 0 ? keyTuples[0][0] : bytes32(0);
  }

  /**
   * Get all connections for an organ
   *
   * @param _organEntity organ entity
   * @return connections
   */
  function getConnections(
    ConnectionType _connectionType,
    bytes32 _organEntity
  ) internal view returns (bytes32[][] memory connections) {
    bytes32 tableId = _connectionType == ConnectionType.RESOURCE ? ResourceConnectionTableId : ControlConnectionTableId;
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.HasValue, tableId, ResourceConnection.encode(_organEntity));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }

  /**
   * Get all connects to food source
   *
   * @return connections
   */
  function getFoodConnections() internal view returns (bytes32[][] memory connections) {
    QueryFragment[] memory fragments = new QueryFragment[](1);
    fragments[0] = QueryFragment(QueryType.Has, StartBlockTableId, new bytes(0));
    bytes32[][] memory keyTuples = query(fragments);
    return keyTuples;
  }
}
