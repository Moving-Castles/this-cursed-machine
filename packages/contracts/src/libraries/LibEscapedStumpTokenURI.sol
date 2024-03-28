// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

import { TokenURI } from "@latticexyz/world-modules/src/modules/erc721-puppet/tables/TokenURI.sol";
import { _tokenUriTableId } from "@latticexyz/world-modules/src/modules/erc721-puppet/utils.sol";
import { Name } from "../codegen/index.sol";
import { ESCAPED_STUMP_TOKEN_NAMESPACE } from "../constants.sol";

library LibEscapedStumpTokenURI {
  string constant SVG_START =
    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">'
    "<style>.base { font-family: serif; font-size: 32px; }</style>"
    '<rect width="100%" height="100%" fill="#1e1e1e" stroke="#3c3c3c" stroke-width="1" />';
  string constant SVG_END = "</svg>";

  function createURI(uint256 tokenId, bytes32 playerEntity) internal {
    TokenURI.set(_tokenUriTableId(ESCAPED_STUMP_TOKEN_NAMESPACE), tokenId, _uri(playerEntity));
  }

  // TODO this uri is a placeholder
  function _uri(bytes32 playerEntity) private view returns (string memory) {
    string memory name = Name.get(playerEntity);

    string memory svg = string.concat(
      SVG_START,
      '<text x="50%" class="base" text-anchor="middle" fill="#ffffff" y="40">',
      name,
      "</text>",
      SVG_END
    );

    // prettier-ignore
    // (manual formatting to make json contents more readable)
    string memory json = Base64.encode(abi.encodePacked(
      '{"name": "', name, '",',
      '"description": "Escaped stump",',
      '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
    ));

    return string.concat("data:application/json;base64,", json);
  }
}
