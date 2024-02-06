// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { TutorialLevel, EntityType, MachineType, OutgoingConnections, IncomingConnections, GameConfig } from "../codegen/index.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";
import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

library LibToken {
  using WorldResourceIdInstance for ResourceId;

  /**
   * @dev Send tokens from world contracrt to an address
   */
  function send(address _to, uint256 _amount) internal {
    IERC20 token = IERC20(GameConfig.getTokenAddress());
    token.transfer(_to, _amount);
  }

  /**
   * @dev Get token balance for a given account
   */
  function getTokenBalance(address account) internal view returns (uint) {
    address token = GameConfig.getTokenAddress();
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _balancesTableId(systemId.getNamespace());
    return Balances.get(tableId, account);
  }

  /**
   * @dev Transfer tokens from the caller to another address
   */
  function transferToken(address worldAddress, address to, uint256 value) internal {
    address token = GameConfig.getTokenAddress();
    ResourceId systemId = Puppet(token).systemId();

    bytes memory callData = abi.encodeCall(IERC20.transfer, (to, value));

    (bool success, ) = worldAddress.delegatecall(abi.encodeCall(IBaseWorld(worldAddress).call, (systemId, callData)));

    require(success, "token transfer failed");
  }
}
