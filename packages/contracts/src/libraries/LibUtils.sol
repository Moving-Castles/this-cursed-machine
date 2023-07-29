// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

library LibUtils {
  /**
   * @notice simple rng calculation
   * @dev     complexity needs to be increased in prod
   * @param   r1  first source of randomness
   * @param   r2  second source of randomness
   * @return  r  random value
   */
  function random(uint256 r1, uint256 r2) internal view returns (uint256 r) {
    return uint256(keccak256(abi.encodePacked(r1, r2, block.difficulty, blockhash(block.number - 1))));
  }

  /**
   * @dev Returns the largest of two numbers.
   */
  function max(int32 a, int32 b) internal pure returns (int32) {
    return a > b ? a : b;
  }

  /**
   * @dev Returns the smallest of two numbers.
   */
  function min(int32 a, int32 b) internal pure returns (int32) {
    return a < b ? a : b;
  }

  /**
   * @dev Clamps return value to _upperBound
   * @param _value value to be clamped
   * @param _upperBound upper bound
   * @return clamped value
   */
  function clamp(uint32 _value, uint32 _upperBound) internal pure returns (uint32) {
    if (_value > _upperBound) {
      return _upperBound;
    } else {
      return _value;
    }
  }

  /**
   * @dev Returns the absolute value
   */
  function abs(int32 x) internal pure returns (int32) {
    return x >= 0 ? x : -x;
  }

  /**
   * @dev Returns the absolute difference
   */
  function absDif(int32 a, int32 b) internal pure returns (uint32) {
    return uint32(a > b ? a - b : b - a);
  }

  /**
   * @dev Conversion from address to bytes32
   */
  function addressToEntityKey(address _address) internal pure returns (bytes32 key) {
    // ?? => bytes32(uint256(uint160(_address)) << 96)
    return bytes32(uint256(uint160(_address)));
  }

  function getRandomKey() internal view returns (bytes32 key) {
    // return keccak256(abi.encode(block.difficulty));
    return keccak256(abi.encode(block.number, msg.sender, gasleft()));
  }
}
