// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { System } from "@latticexyz/world/src/System.sol";
import { Level, CarriedBy, Energy, EntityType, CreationBlock, MaterialType, Amount } from "../codegen/index.sol";
import { PORT_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibPort, LibEntity, LibLevel, LibGoal, LibNetwork, LibMaterial, LibConnection } from "../libraries/Libraries.sol";

contract TransferSystem is System {
  /**
   * @notice Transfers, levels up the core entity, and rearranges entities within a new box configuration.
   * @return boxEntity The identifier of the newly created box entity.
   * @dev Ensure the proper deletion of the old box in future versions.
   */
  function transfer() public returns (bytes32) {
    bytes32 coreEntity = LibUtils.addressToEntityKey(_msgSender());

    uint32 newLevel = Level.get(coreEntity) + 1;

    // New level needs to be in range 2 to 8
    require(newLevel > 1 && newLevel < 9, "illegal level");

    // Resolve network if we are in pod
    if (CarriedBy.get(coreEntity) != bytes32(0)) {
      LibNetwork.resolve(CarriedBy.get(coreEntity));
    }

    // Check goals
    require(LibGoal.goalsAreAchived(coreEntity), "goals not achieved");

    // Transfer goal materials to warehouse
    LibGoal.transferToWarehouse(coreEntity);

    // @todo: calculate performance score

    // Destroy all output in box
    bytes32[][] memory boxOutputs = LibBox.getMaterialsByBox(CarriedBy.get(coreEntity));
    for (uint256 i = 0; i < boxOutputs.length; i++) {
      LibMaterial.destroy(boxOutputs[i][0]);
    }

    // Level up core entity
    Level.set(coreEntity, newLevel);

    if (newLevel == 8) {
      // Core is at level 8, progression done
      // Remove core from box
      CarriedBy.deleteRecord(coreEntity);
      // @todo Destroy old box

      // Return null-pod
      return bytes32(0);
    } else {
      // Core is at level 2-7
      // Level up box
      Level.set(CarriedBy.get(coreEntity), newLevel);
      // Disconnect outlet
      // Get outlet entity
      bytes32[][] memory outletEntities = LibBox.getMachinesOfTypeByBox(CarriedBy.get(coreEntity), MACHINE_TYPE.OUTLET);
      // Get incoming connection
      if (outletEntities[0][0] != bytes32(0)) {
        // Get input port
        bytes32[][] memory outletEntitiesInputPorts = LibPort.getPorts(outletEntities[0][0], PORT_TYPE.INPUT);
        // Get incoming connection
        bytes32 incomingConnection = LibConnection.getIncoming(outletEntitiesInputPorts[0][0]);
        // Destroy connection
        LibConnection.destroy(incomingConnection);
      }

      // Return box
      return CarriedBy.get(coreEntity);
    }
  }
}
