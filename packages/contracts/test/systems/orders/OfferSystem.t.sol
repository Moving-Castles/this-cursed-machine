// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX, MATERIAL_TYPE } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_MINUTE, ONE_HOUR } from "../../../src/constants.sol";

import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { _balancesTableId } from "@latticexyz/world-modules/src/modules/erc20-puppet/utils.sol";
import { Balances } from "@latticexyz/world-modules/src/modules/tokens/tables/Balances.sol";
import { Puppet } from "@latticexyz/world-modules/src/modules/puppet/Puppet.sol";

contract OfferSystemTest is BaseTest {
  using WorldResourceIdInstance for ResourceId;

  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] depotsInPod;
  bytes32[] tutorialLevels;
  FixedEntitiesData fixedEntities;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn();
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    depotsInPod = DepotsInPod.get(podEntity);

    fixedEntities = FixedEntities.get(podEntity);

    tutorialLevels = TutorialOrders.get();

    vm.stopPrank();
  }

  function testCreateOffer() public {
    setUp();

    prankAdmin();

    // Create order
    startGasReport("Create offer");
    bytes32 offerEntity = world.createOffer(MATERIAL_TYPE.BLOOD, 10000, 100);
    endGasReport();

    OfferData memory offerData = Offer.get(offerEntity);

    assertEq(uint8(offerData.materialType), uint8(MATERIAL_TYPE.BLOOD));
    assertEq(offerData.amount, 10000);
    assertEq(offerData.cost, 100);

    vm.stopPrank();
  }

  function testRevertCreateOfferNotAllowed() public {
    setUp();

    vm.startPrank(alice);

    // Create order
    vm.expectRevert("not allowed");
    world.createOffer(MATERIAL_TYPE.BLOOD, 10000, 100);

    vm.stopPrank();
  }

  function testBuyBug() public {
    setUp();

    prankAdmin();
    bytes32 offerEntity = world.createOffer(MATERIAL_TYPE.BUG, 10000, 100);
    vm.stopPrank();

    vm.startPrank(alice);

    world.reward();

    startGasReport("Buy");
    world.buy(offerEntity);
    endGasReport();

    vm.stopPrank();

    assertEq(LibToken.getTokenBalance(alice), 900);
    assertEq(uint8(MaterialType.get(depotsInPod[0])), uint8(MATERIAL_TYPE.BUG));
    assertEq(Amount.get(depotsInPod[0]), 30000);
  }

  function testBuyBlood() public {
    setUp();

    prankAdmin();
    bytes32 offerEntity = world.createOffer(MATERIAL_TYPE.BLOOD, 10000, 100);
    vm.stopPrank();

    vm.startPrank(alice);

    world.reward();

    world.buy(offerEntity);

    vm.stopPrank();

    assertEq(LibToken.getTokenBalance(alice), 900);
    assertEq(uint8(MaterialType.get(depotsInPod[1])), uint8(MATERIAL_TYPE.BLOOD));
    assertEq(Amount.get(depotsInPod[1]), 10000);
  }
}
