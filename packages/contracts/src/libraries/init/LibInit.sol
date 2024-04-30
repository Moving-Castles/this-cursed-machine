// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { GameConfig, GameConfigData } from "../../codegen/index.sol";
import { LibOrder } from "../LibOrder.sol";
import { LibUtils } from "../LibUtils.sol";
import { PublicMaterials } from "./PublicMaterials.sol";
import { FLOW_RATE, TANK_CAPACITY, ONE_UNIT, ONE_HOUR } from "../../constants.sol";

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
        flowRate: FLOW_RATE,
        tankCapacity: TANK_CAPACITY
      })
    );

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 0
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(_adminAddress, PublicMaterials.PISS, 50 * ONE_UNIT, true, 0, 1000 * ONE_UNIT, 0, 0);
    LibOrder.create(_adminAddress, PublicMaterials.BLOOD, 50 * ONE_UNIT, true, 0, 1000 * ONE_UNIT, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 1
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(_adminAddress, PublicMaterials.UREA, 50 * ONE_UNIT, true, 1, 1000 * ONE_UNIT, 0, 0);
    LibOrder.create(_adminAddress, PublicMaterials.BLOOD_CLOTS, 50 * ONE_UNIT, true, 1, 1000 * ONE_UNIT, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 2
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(_adminAddress, PublicMaterials.FERTILIZER, 50 * ONE_UNIT, true, 2, 1000 * ONE_UNIT, 0, 0);
    LibOrder.create(_adminAddress, PublicMaterials.BLOOD_MEAL, 50 * ONE_UNIT, true, 2, 1000 * ONE_UNIT, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 TEST
    //////////////////////////////////////////////////////////////*/

    // // 50 PISS => 500 points
    // LibOrder.create(_adminAddress, PublicMaterials.PISS, 50 * ONE_UNIT, false, 0, 500 * ONE_UNIT, 0, 1);

    // // 50 PISS => 200 points
    // LibOrder.create(_adminAddress, PublicMaterials.PISS, 50 * ONE_UNIT, false, 0, 200 * ONE_UNIT, 0, 20);

    // // 50 BLOOD => 200 points
    // LibOrder.create(_adminAddress, PublicMaterials.BLOOD, 50 * ONE_UNIT, false, 0, 200 * ONE_UNIT, 0, 20);

    // // 50 BLOOD_MEAL => 300 points
    // LibOrder.create(_adminAddress, PublicMaterials.BLOOD_MEAL, 50 * ONE_UNIT, false, 0, 300 * ONE_UNIT, 0, 20);

    // // 50 UREA => 500 points
    // LibOrder.create(_adminAddress, PublicMaterials.UREA, 50 * ONE_UNIT, false, 0, 500 * ONE_UNIT, 0, 10);
  }
}
