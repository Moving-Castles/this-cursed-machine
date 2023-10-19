// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, GameConfig, GameConfigData, Energy, CarriedBy, EntityType, BuildIndex } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE, ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibPort, LibNetwork, LibBox } from "../libraries/Libraries.sol";

contract BuildSystem is System {
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

    // Get build index entity
    bytes32 buildIndexEntity = LibBox.getBuildIndexEntity(CarriedBy.get(coreEntity), _machineType);

    // Increment
    uint32 newBuildIndex = BuildIndex.get(buildIndexEntity) + 1;

    // Set build index on machine
    BuildIndex.set(machineEntity, newBuildIndex);

    // Set global build index
    BuildIndex.set(buildIndexEntity, newBuildIndex);

    // Deduct energy
    Energy.set(coreEntity, Energy.get(coreEntity) - gameConfig.buildCost);

    return machineEntity;
  }
}
