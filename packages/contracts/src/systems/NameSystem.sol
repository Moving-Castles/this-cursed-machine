// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { System } from "@latticexyz/world/src/System.sol";
import { Level, Name } from "../codegen/index.sol";
import { LibUtils, LibNetwork } from "../libraries/Libraries.sol";

contract NameSystem is System {
  /**
   * @notice Assigns a name to the user's player entity.
   * @dev Requires the user's player entity level to be 9, and the name not to be previously set or empty.
   * @param _name The desired name.
   */
  function name(string memory _name) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    require(Level.get(playerEntity) == uint32(8), "not completed");
    // require(keccak256(abi.encodePacked(Name.get(playerEntity))) != keccak256(abi.encodePacked("")), "already named");
    require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), "name empty");
    Name.set(playerEntity, _name);
    // Level up player entity
    Level.set(playerEntity, 9);
  }
}
