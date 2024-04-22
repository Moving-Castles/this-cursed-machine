// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { GameConfig, GameConfigData } from "../../codegen/index.sol";
import { LibOrder } from "../LibOrder.sol";
import { LibUtils } from "../LibUtils.sol";
import { PublicMaterials } from "./PublicMaterials.sol";
import { FLOW_RATE, TANK_CAPACITY } from "../../constants.sol";

library LibInit {
  /**
   * @notice Set game config and create tutorial orders
   * @param _adminAddress The address of the admin
   */
  function init(address _adminAddress) internal {
    // Set game config
    GameConfig.set(
      GameConfigData({
        adminAddress: _adminAddress,
        globalSpawnIndex: 0,
        scaleDown: 100,
        flowRate: FLOW_RATE,
        tankCapacity: TANK_CAPACITY
      })
    );

    bytes32 adminEntity = LibUtils.addressToEntityKey(_adminAddress);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 0
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(adminEntity, "Urine test", PublicMaterials.PISS, 5000, true, 0, 1000, 0, 0);
    LibOrder.create(adminEntity, "Blood test", PublicMaterials.BLOOD, 5000, true, 0, 1000, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 1
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(adminEntity, "", PublicMaterials.UREA, 5000, true, 1, 1000, 0, 0);
    LibOrder.create(adminEntity, "", PublicMaterials.BLOOD_CLOT, 5000, true, 1, 1000, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 2
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(adminEntity, "", PublicMaterials.FERTILIZER, 5000, true, 2, 1000, 0, 0);
    LibOrder.create(adminEntity, "", PublicMaterials.BLOOD_MEAL, 5000, true, 2, 1000, 0, 0);
  }
}
