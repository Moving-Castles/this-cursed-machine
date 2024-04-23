// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema } from "@latticexyz/store/src/Schema.sol";
import { EncodedLengths, EncodedLengthsLib } from "@latticexyz/store/src/EncodedLengths.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";

// Import user types
import { MaterialId } from "./../../libraries/LibMaterial.sol";

struct OrderData {
  uint256 creationBlock;
  address creator;
  MaterialId materialId;
  uint32 amount;
  uint256 expirationBlock;
  uint256 reward;
  uint32 maxPlayers;
  string title;
}

library Order {
  // Hex below is the result of `WorldResourceIdLib.encode({ namespace: "", name: "Order", typeId: RESOURCE_TABLE });`
  ResourceId constant _tableId = ResourceId.wrap(0x746200000000000000000000000000004f726465720000000000000000000000);

  FieldLayout constant _fieldLayout =
    FieldLayout.wrap(0x008a070120140e04202004000000000000000000000000000000000000000000);

  // Hex-encoded key schema of (bytes32)
  Schema constant _keySchema = Schema.wrap(0x002001005f000000000000000000000000000000000000000000000000000000);
  // Hex-encoded value schema of (uint256, address, bytes14, uint32, uint256, uint256, uint32, string)
  Schema constant _valueSchema = Schema.wrap(0x008a07011f614d031f1f03c50000000000000000000000000000000000000000);

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "key";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](8);
    fieldNames[0] = "creationBlock";
    fieldNames[1] = "creator";
    fieldNames[2] = "materialId";
    fieldNames[3] = "amount";
    fieldNames[4] = "expirationBlock";
    fieldNames[5] = "reward";
    fieldNames[6] = "maxPlayers";
    fieldNames[7] = "title";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get creationBlock.
   */
  function getCreationBlock(bytes32 key) internal view returns (uint256 creationBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get creationBlock.
   */
  function _getCreationBlock(bytes32 key) internal view returns (uint256 creationBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set creationBlock.
   */
  function setCreationBlock(bytes32 key, uint256 creationBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((creationBlock)), _fieldLayout);
  }

  /**
   * @notice Set creationBlock.
   */
  function _setCreationBlock(bytes32 key, uint256 creationBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((creationBlock)), _fieldLayout);
  }

  /**
   * @notice Get creator.
   */
  function getCreator(bytes32 key) internal view returns (address creator) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Get creator.
   */
  function _getCreator(bytes32 key) internal view returns (address creator) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (address(bytes20(_blob)));
  }

  /**
   * @notice Set creator.
   */
  function setCreator(bytes32 key, address creator) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((creator)), _fieldLayout);
  }

  /**
   * @notice Set creator.
   */
  function _setCreator(bytes32 key, address creator) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((creator)), _fieldLayout);
  }

  /**
   * @notice Get materialId.
   */
  function getMaterialId(bytes32 key) internal view returns (MaterialId materialId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return MaterialId.wrap(bytes14(_blob));
  }

  /**
   * @notice Get materialId.
   */
  function _getMaterialId(bytes32 key) internal view returns (MaterialId materialId) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return MaterialId.wrap(bytes14(_blob));
  }

  /**
   * @notice Set materialId.
   */
  function setMaterialId(bytes32 key, MaterialId materialId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked(MaterialId.unwrap(materialId)), _fieldLayout);
  }

  /**
   * @notice Set materialId.
   */
  function _setMaterialId(bytes32 key, MaterialId materialId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked(MaterialId.unwrap(materialId)), _fieldLayout);
  }

  /**
   * @notice Get amount.
   */
  function getAmount(bytes32 key) internal view returns (uint32 amount) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get amount.
   */
  function _getAmount(bytes32 key) internal view returns (uint32 amount) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set amount.
   */
  function setAmount(bytes32 key, uint32 amount) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((amount)), _fieldLayout);
  }

  /**
   * @notice Set amount.
   */
  function _setAmount(bytes32 key, uint32 amount) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((amount)), _fieldLayout);
  }

  /**
   * @notice Get expirationBlock.
   */
  function getExpirationBlock(bytes32 key) internal view returns (uint256 expirationBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 4, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get expirationBlock.
   */
  function _getExpirationBlock(bytes32 key) internal view returns (uint256 expirationBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 4, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set expirationBlock.
   */
  function setExpirationBlock(bytes32 key, uint256 expirationBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 4, abi.encodePacked((expirationBlock)), _fieldLayout);
  }

  /**
   * @notice Set expirationBlock.
   */
  function _setExpirationBlock(bytes32 key, uint256 expirationBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 4, abi.encodePacked((expirationBlock)), _fieldLayout);
  }

  /**
   * @notice Get reward.
   */
  function getReward(bytes32 key) internal view returns (uint256 reward) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 5, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get reward.
   */
  function _getReward(bytes32 key) internal view returns (uint256 reward) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 5, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set reward.
   */
  function setReward(bytes32 key, uint256 reward) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 5, abi.encodePacked((reward)), _fieldLayout);
  }

  /**
   * @notice Set reward.
   */
  function _setReward(bytes32 key, uint256 reward) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 5, abi.encodePacked((reward)), _fieldLayout);
  }

  /**
   * @notice Get maxPlayers.
   */
  function getMaxPlayers(bytes32 key) internal view returns (uint32 maxPlayers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 6, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get maxPlayers.
   */
  function _getMaxPlayers(bytes32 key) internal view returns (uint32 maxPlayers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 6, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set maxPlayers.
   */
  function setMaxPlayers(bytes32 key, uint32 maxPlayers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 6, abi.encodePacked((maxPlayers)), _fieldLayout);
  }

  /**
   * @notice Set maxPlayers.
   */
  function _setMaxPlayers(bytes32 key, uint32 maxPlayers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 6, abi.encodePacked((maxPlayers)), _fieldLayout);
  }

  /**
   * @notice Get title.
   */
  function getTitle(bytes32 key) internal view returns (string memory title) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Get title.
   */
  function _getTitle(bytes32 key) internal view returns (string memory title) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Set title.
   */
  function setTitle(bytes32 key, string memory title) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 0, bytes((title)));
  }

  /**
   * @notice Set title.
   */
  function _setTitle(bytes32 key, string memory title) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setDynamicField(_tableId, _keyTuple, 0, bytes((title)));
  }

  /**
   * @notice Get the length of title.
   */
  function lengthTitle(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of title.
   */
  function _lengthTitle(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get an item of title.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemTitle(bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Get an item of title.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemTitle(bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Push a slice to title.
   */
  function pushTitle(bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Push a slice to title.
   */
  function _pushTitle(bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Pop a slice from title.
   */
  function popTitle(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Pop a slice from title.
   */
  function _popTitle(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Update a slice of title at `_index`.
   */
  function updateTitle(bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of title at `_index`.
   */
  function _updateTitle(bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get the full data.
   */
  function get(bytes32 key) internal view returns (OrderData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(bytes32 key) internal view returns (OrderData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(
    bytes32 key,
    uint256 creationBlock,
    address creator,
    MaterialId materialId,
    uint32 amount,
    uint256 expirationBlock,
    uint256 reward,
    uint32 maxPlayers,
    string memory title
  ) internal {
    bytes memory _staticData = encodeStatic(
      creationBlock,
      creator,
      materialId,
      amount,
      expirationBlock,
      reward,
      maxPlayers
    );

    EncodedLengths _encodedLengths = encodeLengths(title);
    bytes memory _dynamicData = encodeDynamic(title);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(
    bytes32 key,
    uint256 creationBlock,
    address creator,
    MaterialId materialId,
    uint32 amount,
    uint256 expirationBlock,
    uint256 reward,
    uint32 maxPlayers,
    string memory title
  ) internal {
    bytes memory _staticData = encodeStatic(
      creationBlock,
      creator,
      materialId,
      amount,
      expirationBlock,
      reward,
      maxPlayers
    );

    EncodedLengths _encodedLengths = encodeLengths(title);
    bytes memory _dynamicData = encodeDynamic(title);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(bytes32 key, OrderData memory _table) internal {
    bytes memory _staticData = encodeStatic(
      _table.creationBlock,
      _table.creator,
      _table.materialId,
      _table.amount,
      _table.expirationBlock,
      _table.reward,
      _table.maxPlayers
    );

    EncodedLengths _encodedLengths = encodeLengths(_table.title);
    bytes memory _dynamicData = encodeDynamic(_table.title);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(bytes32 key, OrderData memory _table) internal {
    bytes memory _staticData = encodeStatic(
      _table.creationBlock,
      _table.creator,
      _table.materialId,
      _table.amount,
      _table.expirationBlock,
      _table.reward,
      _table.maxPlayers
    );

    EncodedLengths _encodedLengths = encodeLengths(_table.title);
    bytes memory _dynamicData = encodeDynamic(_table.title);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  )
    internal
    pure
    returns (
      uint256 creationBlock,
      address creator,
      MaterialId materialId,
      uint32 amount,
      uint256 expirationBlock,
      uint256 reward,
      uint32 maxPlayers
    )
  {
    creationBlock = (uint256(Bytes.getBytes32(_blob, 0)));

    creator = (address(Bytes.getBytes20(_blob, 32)));

    materialId = MaterialId.wrap(Bytes.getBytes14(_blob, 52));

    amount = (uint32(Bytes.getBytes4(_blob, 66)));

    expirationBlock = (uint256(Bytes.getBytes32(_blob, 70)));

    reward = (uint256(Bytes.getBytes32(_blob, 102)));

    maxPlayers = (uint32(Bytes.getBytes4(_blob, 134)));
  }

  /**
   * @notice Decode the tightly packed blob of dynamic data using the encoded lengths.
   */
  function decodeDynamic(
    EncodedLengths _encodedLengths,
    bytes memory _blob
  ) internal pure returns (string memory title) {
    uint256 _start;
    uint256 _end;
    unchecked {
      _end = _encodedLengths.atIndex(0);
    }
    title = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   * @param _encodedLengths Encoded lengths of dynamic fields.
   * @param _dynamicData Tightly packed dynamic fields.
   */
  function decode(
    bytes memory _staticData,
    EncodedLengths _encodedLengths,
    bytes memory _dynamicData
  ) internal pure returns (OrderData memory _table) {
    (
      _table.creationBlock,
      _table.creator,
      _table.materialId,
      _table.amount,
      _table.expirationBlock,
      _table.reward,
      _table.maxPlayers
    ) = decodeStatic(_staticData);

    (_table.title) = decodeDynamic(_encodedLengths, _dynamicData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(
    uint256 creationBlock,
    address creator,
    MaterialId materialId,
    uint32 amount,
    uint256 expirationBlock,
    uint256 reward,
    uint32 maxPlayers
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(creationBlock, creator, materialId, amount, expirationBlock, reward, maxPlayers);
  }

  /**
   * @notice Tightly pack dynamic data lengths using this table's schema.
   * @return _encodedLengths The lengths of the dynamic fields (packed into a single bytes32 value).
   */
  function encodeLengths(string memory title) internal pure returns (EncodedLengths _encodedLengths) {
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = EncodedLengthsLib.pack(bytes(title).length);
    }
  }

  /**
   * @notice Tightly pack dynamic (variable length) data using this table's schema.
   * @return The dynamic data, encoded into a sequence of bytes.
   */
  function encodeDynamic(string memory title) internal pure returns (bytes memory) {
    return abi.encodePacked(bytes((title)));
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dynamic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint256 creationBlock,
    address creator,
    MaterialId materialId,
    uint32 amount,
    uint256 expirationBlock,
    uint256 reward,
    uint32 maxPlayers,
    string memory title
  ) internal pure returns (bytes memory, EncodedLengths, bytes memory) {
    bytes memory _staticData = encodeStatic(
      creationBlock,
      creator,
      materialId,
      amount,
      expirationBlock,
      reward,
      maxPlayers
    );

    EncodedLengths _encodedLengths = encodeLengths(title);
    bytes memory _dynamicData = encodeDynamic(title);

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    return _keyTuple;
  }
}
