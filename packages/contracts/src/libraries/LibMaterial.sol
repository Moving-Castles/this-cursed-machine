// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { IERC20Mintable } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20Mintable.sol";
import { IERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/IERC20.sol";
import { registerERC20 } from "@latticexyz/world-modules/src/modules/erc20-puppet/registerERC20.sol";
import { ERC20MetadataData } from "@latticexyz/world-modules/src/modules/erc20-puppet/tables/ERC20Metadata.sol";
import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

import { WorldContextConsumerLib } from "@latticexyz/world/src/WorldContext.sol";
import { IBaseWorld } from "@latticexyz/world/src/codegen/interfaces/IBaseWorld.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib, WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

// Not using index.sol because of MaterialId circular import
import { MaterialMetadata, MaterialMetadataData } from "../codegen/tables/MaterialMetadata.sol";

type MaterialId is bytes14;

using LibMaterial for MaterialId global;

library LibMaterial {
  using WorldResourceIdInstance for ResourceId;

  function registerMaterial(
    MaterialId _materialId,
    string memory _name,
    string memory _symbol,
    uint32[2] memory _difficultyCoefficient
  ) internal {
    IBaseWorld world = IBaseWorld(WorldContextConsumerLib._world());

    // Register the token
    bytes14 tokenNamespace = MaterialId.unwrap(_materialId);
    IERC20Mintable token = registerERC20(
      world,
      tokenNamespace,
      ERC20MetadataData({ decimals: 18, name: _name, symbol: _symbol })
    );
    // Transfer ownership of the token namespace to the world contract
    // (allows the world to use admin functions like minting)
    world.transferOwnership(WorldResourceIdLib.encodeNamespace(tokenNamespace), address(world));

    // Set other material metadata
    MaterialMetadata.set(
      _materialId,
      MaterialMetadataData({ tokenAddress: address(token), difficultyCoefficient: _difficultyCoefficient })
    );
  }

  /**
   * @dev Mint token to address
   * @param _to address to mint to
   * @param _value amount to mint
   */
  function mint(MaterialId _materialId, address _to, uint256 _value) internal {
    IERC20Mintable token = IERC20Mintable(MaterialMetadata.getTokenAddress(_materialId));
    token.mint(_to, _value);
  }

  /**
   * @dev Transfer tokens
   * @param _to address to transfer to
   * @param _value amount to transfer
   */
  function transferToken(MaterialId _materialId, address _to, uint256 _value) internal {
    address token = MaterialMetadata.getTokenAddress(_materialId);
    ResourceId systemId = Puppet(token).systemId();

    bytes memory callData = abi.encodeCall(IERC20.transfer, (_to, _value));

    address worldAddress = WorldContextConsumerLib._world();
    (bool success, ) = worldAddress.delegatecall(abi.encodeCall(IBaseWorld(worldAddress).call, (systemId, callData)));

    require(success, "token transfer failed");
  }

  /**
   * @dev Get token balance for an account
   * @param _account address to get balance for
   */
  function getTokenBalance(MaterialId _materialId, address _account) internal view returns (uint) {
    address token = MaterialMetadata.getTokenAddress(_materialId);
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _balancesTableId(systemId.getNamespace());
    return Balances.get(tableId, _account);
  }
}
