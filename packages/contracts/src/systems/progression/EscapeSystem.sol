// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { LibToken, LibUtils, LibEscape } from "../../libraries/Libraries.sol";
import { CarriedBy, Completed, EscapeIndex, GameConfig, Tutorial, Name } from "../../codegen/index.sol";

contract EscapeSystem is System {
  function escapePod() public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    // Tutorial must be completed
    require(Tutorial.get(playerEntity) == false, "not completed");
    // Must be named before escape
    require(bytes(Name.get(playerEntity)).length > 0, "name empty");
    // Must not have already escaped
    require(EscapeIndex.get(playerEntity) == 0, "already escaped");
    // TODO determine and add more escape conditions if needed

    // TODO validate podEntity in other systems (preferable), or delete entity and machine types here
    CarriedBy.deleteRecord(playerEntity);

    // Get the number of completed orders
    uint256 completedOrders = Completed.length(playerEntity);

    // Convert all tokens to points, transferring the tokens to world
    uint256 points = LibToken.getTokenBalance(_msgSender());
    LibToken.transferToken(_world(), points);

    // Update indexes and mint NFT for _msgSender()
    LibEscape.incrementIndexesAndMint(playerEntity, completedOrders, points);
  }
}
