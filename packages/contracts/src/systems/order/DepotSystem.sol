// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection, FixedEntities } from "../../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibPod, LibNetwork } from "../../libraries/Libraries.sol";

contract DepotSystem is System {
  function attachDepot(bytes32 _depotEntity, MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_depotEntity) == podEntity, "not in pod");
    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");

    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot already connected");
    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet");

    // todo: allow connecting to second inlet
    bytes32 targetEntity = _machineType == MACHINE_TYPE.INLET
      ? FixedEntities.get(podEntity).inlets[0]
      : FixedEntities.get(podEntity).outlet;

    require(DepotConnection.get(targetEntity) == bytes32(0), "target already connected");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Connect on both sides
    DepotConnection.set(targetEntity, _depotEntity);
    DepotConnection.set(_depotEntity, targetEntity);
  }

  function detachDepot(MACHINE_TYPE _machineType) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(_machineType == MACHINE_TYPE.INLET || _machineType == MACHINE_TYPE.OUTLET, "not inlet/outlet");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // todo: allow disconnection from second inlet
    bytes32 targetEntity = _machineType == MACHINE_TYPE.INLET
      ? FixedEntities.get(podEntity).inlets[0]
      : FixedEntities.get(podEntity).outlet;

    bytes32 _depotEntity = DepotConnection.get(targetEntity);

    // Disconnect on both sides
    DepotConnection.set(targetEntity, bytes32(0));
    DepotConnection.set(_depotEntity, bytes32(0));
  }

  function clearDepot(bytes32 _depotEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_depotEntity) == podEntity, "not in pod");
    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");
    // We can not clear the depot if it is connected
    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot connected");

    // Clear content of depot
    MaterialType.set(_depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(_depotEntity, 0);
  }
}
