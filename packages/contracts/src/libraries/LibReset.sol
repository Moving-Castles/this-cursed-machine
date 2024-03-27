// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { MachineType, IncomingConnections, OutgoingConnections, MachinesInPod, DepotsInPod, DepotConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibEntity } from "./LibEntity.sol";

library LibReset {
  function reset(bytes32 _podEntity) internal {
    bytes32[] memory machineInPod = MachinesInPod.get(_podEntity);

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
        LibEntity.destroy(_podEntity, machineEntity);
      }
    }

    // Detach all depots
    bytes32[] memory depotsInPod = DepotsInPod.get(_podEntity);
    for (uint j; j < depotsInPod.length; j++) {
      DepotConnection.set(depotsInPod[j], bytes32(0));
    }
  }
}
