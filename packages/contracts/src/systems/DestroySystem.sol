// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { ReadyBlock, GameConfig, GameConfigData, Energy, CarriedBy, EntityType } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE, ENTITY_TYPE } from "../codegen/common.sol";
import { LibUtils, LibEntity, LibPort, LibNetwork, LibConnection } from "../libraries/Libraries.sol";

contract DestroySystem is System {
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

    // Get ports of machine
    bytes32[][] memory inputPorts = LibPort.getPorts(_machineEntity, PORT_TYPE.INPUT);
    bytes32[][] memory outputPorts = LibPort.getPorts(_machineEntity, PORT_TYPE.OUTPUT);

    // Input ports
    for (uint i; i < inputPorts.length; i++) {
      // Destroy port
      LibPort.destroy(inputPorts[i][0]);

      bytes32 incomingConnection = LibConnection.getIncoming(inputPorts[i][0]);

      if (incomingConnection != bytes32(0)) {
        // Destroy connection
        LibConnection.destroy(incomingConnection);
      }
    }

    // Output ports
    for (uint i; i < outputPorts.length; i++) {
      // Destroy port
      LibPort.destroy(outputPorts[i][0]);

      bytes32 outgoingConnection = LibConnection.getOutgoing(outputPorts[i][0]);

      if (outgoingConnection != bytes32(0)) {
        // Destroy connection
        LibConnection.destroy(outgoingConnection);
      }
    }
  }
}
