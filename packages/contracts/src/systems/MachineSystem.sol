// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, GameConfig, GameConfigData, Energy, CarriedBy, EntityType } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE, ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibPort, LibNetwork } from "../libraries/Libraries.sol";

contract MachineSystem is System {
  /**
   * @notice Creates a new machine entity and configures its ports and energy.
   * @param _machineType The type of machine to build, specified by the MACHINE_TYPE enum.
   * @return machineEntity The identifier for the newly created machine entity.
   */
  function build(MACHINE_TYPE _machineType) public returns (bytes32) {
    GameConfigData memory gameConfig = GameConfig.get();
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(LibEntity.isBuildableMachineType(_machineType), "not buildable");

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Check energy after resolving network
    require(Energy.get(coreEntity) >= gameConfig.buildCost, "insufficient energy");

    // Create machine entity
    bytes32 machineEntity = LibEntity.create(_machineType);

    // Place in same box as the core
    CarriedBy.set(machineEntity, CarriedBy.get(coreEntity));

    // Create ports on machine
    // - - - - - - - - - - - -
    // SPLITTER:  1 IN, 2 OUT
    // MIXER:     2 IN, 1 OUT
    // WETTER:    1 IN, 1 OUT
    // DRYER:     1 IN, 1 OUT
    // BOILER:    1 IN, 1 OUT
    // COOLER:    1 IN, 1 OUT

    LibPort.create(machineEntity, PORT_TYPE.INPUT);
    LibPort.create(machineEntity, PORT_TYPE.OUTPUT);

    if (_machineType == MACHINE_TYPE.SPLITTER) {
      LibPort.create(machineEntity, PORT_TYPE.OUTPUT);
    } else if (_machineType == MACHINE_TYPE.MIXER) {
      LibPort.create(machineEntity, PORT_TYPE.INPUT);
    }

    // Deduct energy
    Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);

    return machineEntity;
  }

  /**
   * @notice Destroys the specified machine entity.
   * @param _machineEntity The identifier for the machine entity to be destroyed.
   */
  function destroy(bytes32 _machineEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(EntityType.get(_machineEntity) == ENTITY_TYPE.MACHINE, "not machine");

    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Destroy machine entity
    LibEntity.destroy(_machineEntity);

    // @todo: Destroy ports on machine
    // @todo: Destroy connections on machine
  }
}
