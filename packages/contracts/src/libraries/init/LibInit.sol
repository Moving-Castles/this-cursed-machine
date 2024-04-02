// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { GameConfig, GameConfigData } from "../../codegen/index.sol";
import { LibOrder } from "../LibOrder.sol";
import { MATERIAL_TYPE } from "../../codegen/common.sol";
import { FLOW_RATE, DEPOT_CAPACITY } from "../../constants.sol";

library LibInit {
  function init(address _adminAddress, address _tokenAddress) internal {
    // Set game config
    GameConfig.set(
      GameConfigData({
        adminAddress: _adminAddress,
        tokenAddress: _tokenAddress,
        globalSpawnIndex: 0,
        scaleDown: 100,
        flowRate: FLOW_RATE,
        depotCapacity: DEPOT_CAPACITY
      })
    );

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 0
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.PISS, 5000, true, 0, 1000, 0, 0);
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD, 5000, true, 0, 1000, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 1
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.UREA, 5000, true, 1, 1000, 0, 0);
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_CLOT, 5000, true, 1, 1000, 0, 0);

    /*//////////////////////////////////////////////////////////////
                                 LEVEL 2
    //////////////////////////////////////////////////////////////*/

    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.FERTILIZER, 5000, true, 2, 1000, 0, 0);
    LibOrder.create(MATERIAL_TYPE.NONE, 0, MATERIAL_TYPE.BLOOD_MEAL, 5000, true, 2, 1000, 0, 0);
  }
}
