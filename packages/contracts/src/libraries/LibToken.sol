// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { TutorialLevel, EntityType, MachineType, OutgoingConnections, IncomingConnections, GameConfig } from "../codegen/index.sol";

import { WorldContextConsumerLib } from "@latticexyz/world/src/WorldContext.sol";
import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { IERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20.sol";
import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

library LibToken {
  using WorldResourceIdInstance for ResourceId;

  /**
   * @dev Mint token to address
   * @param _to address to mint to
   * @param _value amount to mint
   */
  function mint(address _to, uint256 _value) internal {
    IERC20Mintable token = IERC20Mintable(GameConfig.getTokenAddress());
    token.mint(_to, _value);
  }

  /**
   * @dev Transfer tokens
   * @param _to address to transfer to
   * @param _value amount to transfer
   */
  function transferToken(address _to, uint256 _value) internal {
    address token = GameConfig.getTokenAddress();
    ResourceId systemId = Puppet(token).systemId();

    bytes memory callData = abi.encodeCall(IERC20.transfer, (_to, _value));

    address worldAddress = WorldContextConsumerLib._world();
    (bool success, ) = worldAddress.delegatecall(abi.encodeCall(IBaseWorld(worldAddress).call, (systemId, callData)));

    require(success, "token transfer failed");
  }

  /**
   * @dev Get token balance for an account
   * @param account address to get balance for
   */
  function getTokenBalance(address account) internal view returns (uint) {
    address token = GameConfig.getTokenAddress();
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _balancesTableId(systemId.getNamespace());
    return Balances.get(tableId, account);
  }
}
