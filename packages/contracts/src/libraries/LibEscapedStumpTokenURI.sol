// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";

import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";
import { TokenURI } from "@latticexyz/world-modules/src/modules/erc721-puppet/tables/TokenURI.sol";
import { _tokenUriTableId } from "@latticexyz/world-modules/src/modules/erc721-puppet/utils.sol";

import { GameConfig, Name, Completed } from "../codegen/index.sol";

library LibEscapedStumpTokenURI {
  using WorldResourceIdInstance for ResourceId;

  function initTokenURI(uint256 _tokenId, bytes32 _playerEntity, uint256 _points, uint256 _completedOrders) internal {
    address token = GameConfig.getEscapedStumpTokenAddress();
    ResourceId systemId = Puppet(token).systemId();
    ResourceId tableId = _tokenUriTableId(systemId.getNamespace());

    string memory uri = _uri(_playerEntity, _points, _completedOrders);
    TokenURI.set(tableId, _tokenId, uri);
  }

  function _uri(bytes32 _playerEntity, uint256 _points, uint256 _completedOrders) private view returns (string memory) {
    string memory playerName = Name.get(_playerEntity);
    // TODO rank name
    string memory rankName = "placeholder";

    // prettier-ignore
    // (manual formatting to make json contents more readable)
    string memory json = Base64.encode(abi.encodePacked(
      // TODO should this be the player name or sth else?
      '{"name": "', playerName, '",',
      // TODO custom descriptions?
      '"description": "Escaped stump",',
      '"attributes": ['
        '{'
          '"trait_type": "Player Name",'
          '"value": "', playerName, '"'
        '},'
        '{'
          '"trait_type": "Rank Name",'
          '"value": "', rankName, '"'
        '},'
        '{'
          '"trait_type": "Points",'
          '"value": ', _points,
        '},'
        '{'
          '"trait_type": "Completed Orders",'
          '"value": ', _completedOrders,
        '},'
        '{'
          '"trait_type": "Escape Block Number",'
          '"value": ', block.number,
        '}'
      '],'
      '"image": "https://PLACEHOLDER_IMAGE_URL/', '', '"}'
    ));

    return string.concat("data:application/json;base64,", json);
  }
}
