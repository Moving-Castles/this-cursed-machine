// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { IWorld } from "../codegen/world/IWorld.sol";
import { PortType, CarriedBy, EntityType, MachineType, CreationBlock, Position } from "../codegen/Tables.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/Types.sol";
import { LibUtils } from "./LibUtils.sol";

library LibEntity {
  function create(MACHINE_TYPE _machineType) internal returns (bytes32) {
    bytes32 entity = LibUtils.getRandomKey();
    // For now..
    EntityType.set(entity, ENTITY_TYPE.MACHINE);
    MachineType.set(entity, _machineType);
    CreationBlock.set(entity, block.number);
    return entity;
  }

  function destroy(bytes32 _entity) internal {
    EntityType.deleteRecord(_entity);
    MachineType.deleteRecord(_entity);
    CreationBlock.deleteRecord(_entity);
    Position.deleteRecord(_entity);
  }
}
