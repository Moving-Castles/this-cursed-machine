// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { MachineType, IncomingConnections, OutgoingConnections, MachinesInPod, TanksInPod, TankConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils } from "./LibUtils.sol";
import { LibEntity } from "./LibEntity.sol";

library LibWipe {
  /**
   * @notice Wipes pod network
   * @dev Remove all machines excvept fixed ones. Remove all connections and tank attachements
   * @param _podEntity Pod entity
   */
  function wipe(bytes32 _podEntity) internal {
    bytes32[] memory machineInPod = MachinesInPod.get(_podEntity);

    for (uint i; i < machineInPod.length; i++) {
      bytes32 machineEntity = machineInPod[i];
      MACHINE_TYPE machineType = MachineType.get(machineEntity);

      // Destroy all connections and non-fixed machines
      if (machineType == MACHINE_TYPE.PLAYER) {
        IncomingConnections.set(machineEntity, new bytes32[](1));
        OutgoingConnections.set(machineEntity, new bytes32[](2));
      } else if (machineType == MACHINE_TYPE.INLET) {
        IncomingConnections.set(machineEntity, new bytes32[](0));
        OutgoingConnections.set(machineEntity, new bytes32[](1));
        TankConnection.set(machineEntity, bytes32(0));
      } else if (machineType == MACHINE_TYPE.OUTLET) {
        IncomingConnections.set(machineEntity, new bytes32[](1));
        OutgoingConnections.set(machineEntity, new bytes32[](0));
        TankConnection.set(machineEntity, bytes32(0));
      } else {
        LibEntity.remove(_podEntity, machineEntity);
      }
    }

    // Unplug all tanks
    bytes32[] memory tanksInPod = TanksInPod.get(_podEntity);
    for (uint j; j < tanksInPod.length; j++) {
      TankConnection.set(tanksInPod[j], bytes32(0));
    }
  }
}
