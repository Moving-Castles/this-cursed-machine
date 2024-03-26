// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { GameConfig, GameConfigData, CarriedBy, EntityType, MachineType, MachinesInPod, IncomingConnections, OutgoingConnections, DepotConnection, DepotsInPod } from "../../codegen/index.sol";
import { MACHINE_TYPE, ENTITY_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibEntity, LibNetwork } from "../../libraries/Libraries.sol";

contract ResetSystem is System {
  function reset() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    bytes32[] memory machineInPod = MachinesInPod.get(podEntity);

    for (uint i; i < machineInPod.length; i++) {
      bytes32 machineEntity = machineInPod[i];
      MACHINE_TYPE machineType = MachineType.get(machineEntity);

      // Destroy all connections and non-fixed mayhines
      if (machineType == MACHINE_TYPE.PLAYER) {
        IncomingConnections.set(machineEntity, new bytes32[](1));
        OutgoingConnections.set(machineEntity, new bytes32[](2));
      } else if (machineType == MACHINE_TYPE.INLET) {
        IncomingConnections.set(machineEntity, new bytes32[](0));
        OutgoingConnections.set(machineEntity, new bytes32[](1));
        DepotConnection.set(machineEntity, bytes32(0));
      } else if (machineType == MACHINE_TYPE.OUTLET) {
        IncomingConnections.set(machineEntity, new bytes32[](1));
        OutgoingConnections.set(machineEntity, new bytes32[](0));
        DepotConnection.set(machineEntity, bytes32(0));
      } else {
        LibEntity.destroy(podEntity, machineEntity);
      }
    }

    // Detach all depots
    bytes32[] memory depotsInPod = DepotsInPod.get(podEntity);
    for (uint j; j < depotsInPod.length; j++) {
      DepotConnection.set(depotsInPod[j], bytes32(0));
    }

    LibNetwork.resolve(podEntity);
  }
}
