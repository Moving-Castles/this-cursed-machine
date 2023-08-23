// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16("mc"), bytes16("GameConfig")));
bytes32 constant GameConfigTableId = _tableId;

struct GameConfigData {
  uint32 coolDown;
  uint32 coreEnergyCap;
  uint32 coreInitialEnergy;
  uint32 resourceConnectionCost;
  uint32 controlConnectionCost;
  uint32 buildCost;
}

library GameConfig {
  /** Get the table's key schema */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](0);

    return SchemaLib.encode(_schema);
  }

  /** Get the table's value schema */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](6);
    _schema[0] = SchemaType.UINT32;
    _schema[1] = SchemaType.UINT32;
    _schema[2] = SchemaType.UINT32;
    _schema[3] = SchemaType.UINT32;
    _schema[4] = SchemaType.UINT32;
    _schema[5] = SchemaType.UINT32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's key names */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](0);
  }

  /** Get the table's field names */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](6);
    fieldNames[0] = "coolDown";
    fieldNames[1] = "coreEnergyCap";
    fieldNames[2] = "coreInitialEnergy";
    fieldNames[3] = "resourceConnectionCost";
    fieldNames[4] = "controlConnectionCost";
    fieldNames[5] = "buildCost";
  }

  /** Register the table's key schema, value schema, key names and value names */
  function register() internal {
    StoreSwitch.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Register the table's key schema, value schema, key names and value names (using the specified store) */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Get coolDown */
  function getCoolDown() internal view returns (uint32 coolDown) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get coolDown (using the specified store) */
  function getCoolDown(IStore _store) internal view returns (uint32 coolDown) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set coolDown */
  function setCoolDown(uint32 coolDown) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((coolDown)), getValueSchema());
  }

  /** Set coolDown (using the specified store) */
  function setCoolDown(IStore _store, uint32 coolDown) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((coolDown)), getValueSchema());
  }

  /** Get coreEnergyCap */
  function getCoreEnergyCap() internal view returns (uint32 coreEnergyCap) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get coreEnergyCap (using the specified store) */
  function getCoreEnergyCap(IStore _store) internal view returns (uint32 coreEnergyCap) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set coreEnergyCap */
  function setCoreEnergyCap(uint32 coreEnergyCap) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((coreEnergyCap)), getValueSchema());
  }

  /** Set coreEnergyCap (using the specified store) */
  function setCoreEnergyCap(IStore _store, uint32 coreEnergyCap) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((coreEnergyCap)), getValueSchema());
  }

  /** Get coreInitialEnergy */
  function getCoreInitialEnergy() internal view returns (uint32 coreInitialEnergy) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get coreInitialEnergy (using the specified store) */
  function getCoreInitialEnergy(IStore _store) internal view returns (uint32 coreInitialEnergy) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set coreInitialEnergy */
  function setCoreInitialEnergy(uint32 coreInitialEnergy) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((coreInitialEnergy)), getValueSchema());
  }

  /** Set coreInitialEnergy (using the specified store) */
  function setCoreInitialEnergy(IStore _store, uint32 coreInitialEnergy) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((coreInitialEnergy)), getValueSchema());
  }

  /** Get resourceConnectionCost */
  function getResourceConnectionCost() internal view returns (uint32 resourceConnectionCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get resourceConnectionCost (using the specified store) */
  function getResourceConnectionCost(IStore _store) internal view returns (uint32 resourceConnectionCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set resourceConnectionCost */
  function setResourceConnectionCost(uint32 resourceConnectionCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked((resourceConnectionCost)), getValueSchema());
  }

  /** Set resourceConnectionCost (using the specified store) */
  function setResourceConnectionCost(IStore _store, uint32 resourceConnectionCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked((resourceConnectionCost)), getValueSchema());
  }

  /** Get controlConnectionCost */
  function getControlConnectionCost() internal view returns (uint32 controlConnectionCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 4, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get controlConnectionCost (using the specified store) */
  function getControlConnectionCost(IStore _store) internal view returns (uint32 controlConnectionCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 4, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set controlConnectionCost */
  function setControlConnectionCost(uint32 controlConnectionCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 4, abi.encodePacked((controlConnectionCost)), getValueSchema());
  }

  /** Set controlConnectionCost (using the specified store) */
  function setControlConnectionCost(IStore _store, uint32 controlConnectionCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 4, abi.encodePacked((controlConnectionCost)), getValueSchema());
  }

  /** Get buildCost */
  function getBuildCost() internal view returns (uint32 buildCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 5, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Get buildCost (using the specified store) */
  function getBuildCost(IStore _store) internal view returns (uint32 buildCost) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 5, getValueSchema());
    return (uint32(Bytes.slice4(_blob, 0)));
  }

  /** Set buildCost */
  function setBuildCost(uint32 buildCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setField(_tableId, _keyTuple, 5, abi.encodePacked((buildCost)), getValueSchema());
  }

  /** Set buildCost (using the specified store) */
  function setBuildCost(IStore _store, uint32 buildCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setField(_tableId, _keyTuple, 5, abi.encodePacked((buildCost)), getValueSchema());
  }

  /** Get the full data */
  function get() internal view returns (GameConfigData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getValueSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store) internal view returns (GameConfigData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getValueSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    uint32 coolDown,
    uint32 coreEnergyCap,
    uint32 coreInitialEnergy,
    uint32 resourceConnectionCost,
    uint32 controlConnectionCost,
    uint32 buildCost
  ) internal {
    bytes memory _data = encode(
      coolDown,
      coreEnergyCap,
      coreInitialEnergy,
      resourceConnectionCost,
      controlConnectionCost,
      buildCost
    );

    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.setRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    uint32 coolDown,
    uint32 coreEnergyCap,
    uint32 coreInitialEnergy,
    uint32 resourceConnectionCost,
    uint32 controlConnectionCost,
    uint32 buildCost
  ) internal {
    bytes memory _data = encode(
      coolDown,
      coreEnergyCap,
      coreInitialEnergy,
      resourceConnectionCost,
      controlConnectionCost,
      buildCost
    );

    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.setRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Set the full data using the data struct */
  function set(GameConfigData memory _table) internal {
    set(
      _table.coolDown,
      _table.coreEnergyCap,
      _table.coreInitialEnergy,
      _table.resourceConnectionCost,
      _table.controlConnectionCost,
      _table.buildCost
    );
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, GameConfigData memory _table) internal {
    set(
      _store,
      _table.coolDown,
      _table.coreEnergyCap,
      _table.coreInitialEnergy,
      _table.resourceConnectionCost,
      _table.controlConnectionCost,
      _table.buildCost
    );
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (GameConfigData memory _table) {
    _table.coolDown = (uint32(Bytes.slice4(_blob, 0)));

    _table.coreEnergyCap = (uint32(Bytes.slice4(_blob, 4)));

    _table.coreInitialEnergy = (uint32(Bytes.slice4(_blob, 8)));

    _table.resourceConnectionCost = (uint32(Bytes.slice4(_blob, 12)));

    _table.controlConnectionCost = (uint32(Bytes.slice4(_blob, 16)));

    _table.buildCost = (uint32(Bytes.slice4(_blob, 20)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    uint32 coolDown,
    uint32 coreEnergyCap,
    uint32 coreInitialEnergy,
    uint32 resourceConnectionCost,
    uint32 controlConnectionCost,
    uint32 buildCost
  ) internal pure returns (bytes memory) {
    return
      abi.encodePacked(
        coolDown,
        coreEnergyCap,
        coreInitialEnergy,
        resourceConnectionCost,
        controlConnectionCost,
        buildCost
      );
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple() internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](0);

    return _keyTuple;
  }

  /* Delete all data for given keys */
  function deleteRecord() internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    StoreSwitch.deleteRecord(_tableId, _keyTuple, getValueSchema());
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store) internal {
    bytes32[] memory _keyTuple = new bytes32[](0);

    _store.deleteRecord(_tableId, _keyTuple, getValueSchema());
  }
}
