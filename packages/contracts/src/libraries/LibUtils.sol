// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

library LibUtils {
  /**
   * @notice simple rng calculation
   * @dev     complexity needs to be increased in prod
   * @param   r1  first source of randomness
   * @param   r2  second source of randomness
   * @return  r  random value
   */
  function random(uint256 r1, uint256 r2) internal view returns (uint256 r) {
    return uint256(keccak256(abi.encodePacked(r1, r2, block.prevrandao, blockhash(block.number - 1))));
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
    return bytes32(uint256(uint160(_address)));
  }

  /**
   * @notice Generate a unique identifier for a pair of `uint` values.
   * @dev This function uses the Cantor pairing function to produce a unique
   * identifier from two `uint` values. The order of input values does not affect
   * the generated identifier, meaning that (a, b) will produce the same output
   * as (b, a). Note that the input values should represent valid `MATERIAL_TYPE`
   * enum values to ensure consistent behavior.
   * @param a First `uint` value representing a `MATERIAL_TYPE`.
   * @param b Second `uint` value representing a `MATERIAL_TYPE`.
   * @return A unique identifier derived from the inputs (a, b).
   */
  function getUniqueIdentifier(uint256 a, uint256 b) internal pure returns (uint256) {
    // Ensure a is always smaller than or equal to b
    if (a > b) {
      (a, b) = (b, a);
    }

    return ((a + b) * (a + b + 1)) / 2 + b;
  }

  /**
   * @dev Removes an element from an array of `bytes32` if it exists and returns the new array.
   * @param array The original array of `bytes32` elements.
   * @param element The `bytes32` element to be removed from the array.
   * @return newArray The new array containing all elements of the original array except for the removed element.
   */
  function removeFromArray(bytes32[] memory array, bytes32 element) internal pure returns (bytes32[] memory) {
    // Determine if the element exists and the index of the element to be removed
    bool found = false;
    uint256 foundIndex = 0;
    for (uint256 i = 0; i < array.length; i++) {
      if (array[i] == element) {
        found = true;
        foundIndex = i;
        break;
      }
    }

    // If the element was not found, return the original array
    if (!found) {
      return array;
    }

    // Create a new array of length `array.length - 1` to store the result
    bytes32[] memory newArray = new bytes32[](array.length - 1);

    // Copy elements from the original array to the new array, skipping the removed element
    uint256 j = 0;
    for (uint256 i = 0; i < array.length; i++) {
      if (i != foundIndex) {
        newArray[j] = array[i];
        j++;
      }
    }

    return newArray;
  }

  /**
   * @dev Checks equality of two strings
   */
  function stringEq(string memory a, string memory b) internal pure returns (bool) {
    if (bytes(a).length != bytes(b).length) {
      return false;
    } else {
      return keccak256(bytes(a)) == keccak256(bytes(b));
    }
  }

  /**
   * @dev Subtract without underflow
   */
  function safeSubtract(uint32 a, uint32 b) internal pure returns (uint32) {
    if (b > a) {
      // If b is greater than a, return 0 to prevent underflow
      return 0;
    } else {
      // Otherwise, subtraction is safe, so return the result
      return a - b;
    }
  }

  /**
   * @dev Check if an element is included in an array
   * @param array The array to check
   * @param element The element to check for
   */
  function arrayIncludes(uint8[] memory array, uint8 element) internal pure returns (bool) {
    for (uint256 i = 0; i < array.length; i++) {
      if (array[i] == element) {
        return true;
      }
    }
    return false;
  }
}
