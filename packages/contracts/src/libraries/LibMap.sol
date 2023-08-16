// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Position, PositionTableId, PositionData, EntityType, EntityTypeTableId, ClaimBlockTableId, Width, Height } from "../codegen/Tables.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { ENTITY_TYPE } from "../codegen/Types.sol";
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
   * @dev Checks if the provided coordinates are within the boundaries of the specified box entity.
   *
   * The function checks each dimension (x and y) of the provided coordinates against the width and height
   * of the box entity. The coordinates are considered to be within bounds if they are non-negative and
   * less than the respective dimensions of the box entity.
   *
   * @param _coordinates The position data containing x and y values to be checked.
   * @param _boxEntity The bytes32 key associated with the box entity against which the bounds check will be performed.
   *
   * @return withinBounds Returns `true` if the coordinates are within the bounds of the box entity, and `false` otherwise.
   */
  function isWithinBounds(
    PositionData memory _coordinates,
    bytes32 _boxEntity
  ) internal view returns (bool withinBounds) {
    // GameConfigData memory gameConfig = GameConfig.get();
    if (_coordinates.x < 0) return false;
    if (_coordinates.x > Width.get(_boxEntity) - 1) return false;
    if (_coordinates.y < 0) return false;
    if (_coordinates.y > Height.get(_boxEntity) - 1) return false;
    return true;
  }

  /**
   * @dev Generates pseudo-random coordinates within the boundaries of the specified box entity.
   *
   * This function uses the `LibUtils.random` function with varying seeds, such as `block.timestamp` and `block.number`,
   * to produce pseudo-random x and y coordinates. The generated coordinates are then constrained to lie within the
   * width and height of the specified box entity. Additionally, the function ensures that the generated coordinates
   * are non-negative.
   *
   * It's important to note that while the generated coordinates may seem random, they can be deterministically
   * recreated with the same seeds and are not suitable for strong cryptographic purposes.
   *
   * @param _boxEntity The bytes32 key associated with the box entity within whose bounds the random coordinates will be generated.
   *
   * @return position A pseudo-randomly generated position data containing x and y coordinates within the bounds of the box entity.
   */
  function randomCoordinates(bytes32 _boxEntity) internal view returns (PositionData memory position) {
    // GameConfigData memory gameConfig = GameConfig.get();

    int32 x = int32(int256(LibUtils.random(666, block.timestamp)) % Width.get(_boxEntity));
    int32 y = int32(int256(LibUtils.random(block.timestamp, block.number)) % Height.get(_boxEntity));

    // Make sure the values are positive
    if (x < 0) x *= -1;
    if (y < 0) y *= -1;

    return PositionData(x, y);
  }
}
