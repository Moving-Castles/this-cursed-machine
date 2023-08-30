// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, EntityType, GameConfig, GameConfigData, Rotation, CarriedBy } from "../codegen/Tables.sol";
import { ROTATION } from "../codegen/Types.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract RotationSystem is System {
  function rotate(bytes32 _entity, ROTATION _rotation) public {
    // GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));

    Rotation.set(_entity, _rotation);
  }
}
