// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, Energy, EntityType, PortType, GameConfig, GameConfigData, CarriedBy } from "../codegen/index.sol";
import { ENTITY_TYPE, PORT_TYPE } from "../codegen/common.sol";
import { LibUtils, LibConnection, LibNetwork } from "../libraries/Libraries.sol";

contract ConnectionSystem is System {
  /**
   * @notice Establishes a connection between two distinct port entities.
   * @param _sourcePort The identifier of the source port entity.
   * @param _targetPort The identifier of the target port entity.
   * @return connectionEntity The identifier of the newly created connection entity.
   */
  function connect(bytes32 _sourcePort, bytes32 _targetPort) public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(EntityType.get(_sourcePort) == ENTITY_TYPE.PORT, "source not port");
    require(EntityType.get(_targetPort) == ENTITY_TYPE.PORT, "target not port");
    require(PortType.get(_sourcePort) == PORT_TYPE.OUTPUT, "source not output");
    require(PortType.get(_targetPort) == PORT_TYPE.INPUT, "target not input");

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Check energy after resolving network
    require(Energy.get(coreEntity) >= GameConfig.get().connectionCost, "insufficient energy");

    // Create connection entity
    bytes32 connectionEntity = LibConnection.create(_sourcePort, _targetPort);

    // Deduct energy
    Energy.set(coreEntity, Energy.get(coreEntity) - GameConfig.get().connectionCost);

    return connectionEntity;
  }

  /**
   * @notice Dismantles an existing connection entity.
   * @param _connectionEntity The identifier of the connection entity to be destroyed.
   */
  function disconnect(bytes32 _connectionEntity) public {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());
    require(ReadyBlock.get(coreEntity) <= block.number, "core in cooldown");
    require(EntityType.get(_connectionEntity) == ENTITY_TYPE.CONNECTION, "not connection");

    LibNetwork.resolve(CarriedBy.get(coreEntity));

    // Destroy connection entity
    LibConnection.destroy(_connectionEntity);
  }
}
