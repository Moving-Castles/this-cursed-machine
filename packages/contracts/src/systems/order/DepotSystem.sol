// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { System } from "@latticexyz/world/src/System.sol";
import { EntityType, CarriedBy, MaterialType, MachineType, Amount, DepotConnection } from "../../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../../codegen/common.sol";
import { LibUtils, LibNetwork } from "../../libraries/Libraries.sol";

contract DepotSystem is System {
  /**
   * @notice Attach depot to inlet or outlet
   * @dev Resolves network
   * @param _depotEntity Id of depot entity
   * @param _targetEntity Id of inlet or outlet entity
   */
  function attachDepot(bytes32 _depotEntity, bytes32 _targetEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());
    bytes32 podEntity = CarriedBy.get(playerEntity);

    require(CarriedBy.get(_depotEntity) == podEntity, "not in pod");
    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");

    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot already connected");

    // Depots can only be connected to inlets or outlets
    require(
      MachineType.get(_targetEntity) == MACHINE_TYPE.INLET || MachineType.get(_targetEntity) == MACHINE_TYPE.OUTLET,
      "not inlet/outlet"
    );

    require(DepotConnection.get(_targetEntity) == bytes32(0), "target already connected");

    // Resolve network
    LibNetwork.resolve(podEntity);

    // Connect on both sides
    DepotConnection.set(_targetEntity, _depotEntity);
    DepotConnection.set(_depotEntity, _targetEntity);
  }

  /**
   * @notice Detach depot from inlet or outlet
   * @dev Resolves network
   * @param _depotEntity Id of depot entity
   */
  function detachDepot(bytes32 _depotEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    bytes32 _targetEntity = DepotConnection.get(_depotEntity);

    // Resolve network
    LibNetwork.resolve(CarriedBy.get(playerEntity));

    // Disconnect on both sides
    DepotConnection.set(_targetEntity, bytes32(0));
    DepotConnection.set(_depotEntity, bytes32(0));
  }

  /**
   * @notice Empty depot
   * @param _depotEntity Id of depot entity
   */
  function emptyDepot(bytes32 _depotEntity) public {
    bytes32 playerEntity = LibUtils.addressToEntityKey(_msgSender());

    require(CarriedBy.get(_depotEntity) == CarriedBy.get(playerEntity), "not in pod");
    require(EntityType.get(_depotEntity) == ENTITY_TYPE.DEPOT, "not depot");
    // We can not clear the depot if it is connected
    require(DepotConnection.get(_depotEntity) == bytes32(0), "depot connected");

    // Clear content of depot
    MaterialType.set(_depotEntity, MATERIAL_TYPE.NONE);
    Amount.set(_depotEntity, 0);
  }
}
