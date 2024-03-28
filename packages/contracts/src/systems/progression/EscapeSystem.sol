// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { IERC721Mintable } from "@latticexyz/world-modules/src/modules/erc721-puppet/IERC721Mintable.sol";
import { LibUtils } from "../../libraries/Libraries.sol";
import { CarriedBy, EscapeIndex, GameConfig, Tutorial, Name } from "../../codegen/index.sol";

contract EscapeSystem is System {
  function escape() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Tutorial must be completed
    require(Tutorial.get(playerEntity) != false, "not completed");
    // Must be named before escape
    require(bytes(Name.get(playerEntity)).length > 0, "name empty");
    // Must not have already escaped
    require(EscapeIndex.get(playerEntity) == 0, "already escaped");
    // TODO determine and add more escape conditions if needed

    uint32 newEscapeIndex = GameConfig.getGlobalEscapeIndex() + 1;
    GameConfig.setGlobalEscapeIndex(newEscapeIndex);
    EscapeIndex.set(playerEntity, newEscapeIndex);

    // TODO validate podEntity in other systems (preferable), or delete entity and machine types here
    CarriedBy.deleteRecord(playerEntity);

    IERC721Mintable token = IERC721Mintable(GameConfig.getEscapedStumpTokenAddress());
    token.safeMint(_msgSender(), newEscapeIndex);
  }
}
