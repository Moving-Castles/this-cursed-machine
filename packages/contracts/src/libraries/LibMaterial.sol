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

import { MATERIAL_DIFFICULTY} from "../codegen/common.sol";

type MaterialId is bytes14;

using LibMaterial for MaterialId global;

function eq(MaterialId _a, MaterialId _b) pure returns (bool) {
  return MaterialId.unwrap(_a) == MaterialId.unwrap(_b);
}

function ne(MaterialId _a, MaterialId _b) pure returns (bool) {
  return MaterialId.unwrap(_a) != MaterialId.unwrap(_b);
}

using { eq as ==, ne as != } for MaterialId global;

library LibMaterial {
  using WorldResourceIdInstance for ResourceId;

  MaterialId constant NONE = MaterialId.wrap(bytes14(0));

  function registerMaterial(
    MaterialId _materialId,
    string memory _name,
    string memory _symbol,
    MATERIAL_DIFFICULTY _difficulty
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
      MaterialMetadataData({ difficulty: _difficulty, tokenAddress: address(token), name: _name })
    );
  }

  /**
   * @dev Mint token to address
   * @param _materialId material id to mint
   * @param _to address to mint to
   * @param _value amount to mint
   */
  function mint(MaterialId _materialId, address _to, uint256 _value) internal {
    IERC20Mintable token = IERC20Mintable(MaterialMetadata.getTokenAddress(_materialId));
    token.mint(_to, _value);
  }

  /**
   * @dev Burn token from address
   * @param _materialId material id to burn
   * @param _to address to burn from
   * @param _value amount to burn
   */
  function burn(MaterialId _materialId, address _to, uint256 _value) internal {
    IERC20Mintable token = IERC20Mintable(MaterialMetadata.getTokenAddress(_materialId));
    token.burn(_to, _value);
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

  /**
   * Get id for a combination of 1 material
   * @param _a Material id
   */
  function getMaterialCombinationId(MaterialId _a) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(_a));
  }

  /**
   * Get id for a combination of 2 materials
   * @param _a Material id
   * @param _b Material id
   */
  function getMaterialCombinationId(MaterialId _a, MaterialId _b) internal pure returns (bytes32) {
    // Always sort the ids in ascending order to make the combination order-agnostic
    if (MaterialId.unwrap(_a) > MaterialId.unwrap(_b)) {
      return keccak256(abi.encodePacked(_b, _a));
    } else {
      return keccak256(abi.encodePacked(_a, _b));
    }
  }

  /**
   * Whether the material has been registered
   */
  function isRegistered(MaterialId _materialId) internal view returns (bool) {
    if (_materialId.unwrap() == bytes14(0)) {
      // Always consider 0 id unregistered, even if by some mistake a token for it is added
      return false;
    }
    return MaterialMetadata.getTokenAddress(_materialId) != address(0);
  }

  function unwrap(MaterialId _materialId) internal pure returns (bytes14) {
    return MaterialId.unwrap(_materialId);
  }
}
