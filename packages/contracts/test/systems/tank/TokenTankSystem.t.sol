// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { FLOW_RATE, ONE_MINUTE, ONE_HOUR, ONE_UNIT, TANK_CAPACITY } from "../../../src/constants.sol";

contract TokenTankSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] tanksInPod;
  bytes32[] tutorialLevels;
  FixedEntitiesData fixedEntities;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    // Spawn player
    playerEntity = world.spawn("alice");
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    tanksInPod = TanksInPod.get(podEntity);

    fixedEntities = FixedEntities.get(podEntity);

    vm.stopPrank();

    // Give player some BUGS and AMPHETAMINE tokens
    vm.startPrank(worldAddress);
    PublicMaterials.BUGS.mint(alice, 100 * ONE_UNIT);
    PublicMaterials.AMPHETAMINE.mint(alice, 100 * ONE_UNIT);
    vm.stopPrank();
  }

  function testFillTank() public {
    // Fill 1st tank with BUGS
    vm.startPrank(alice);
    startGasReport("Fill tank");
    world.fillTank(tanksInPod[0], 80, PublicMaterials.BUGS);
    endGasReport();
    vm.stopPrank();

    assertEq(PublicMaterials.BUGS.getTokenBalance(alice), 20 * ONE_UNIT);
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), PublicMaterials.BUGS.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 80 * ONE_UNIT);

    // Fill 2nd tank with AMPHETAMINE twice
    vm.startPrank(alice);
    world.fillTank(tanksInPod[1], 30, PublicMaterials.AMPHETAMINE);
    world.fillTank(tanksInPod[1], 30, PublicMaterials.AMPHETAMINE);
    vm.stopPrank();

    assertEq(PublicMaterials.AMPHETAMINE.getTokenBalance(alice), 40 * ONE_UNIT);
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), PublicMaterials.AMPHETAMINE.unwrap());
    assertEq(Amount.get(tanksInPod[1]), 60 * ONE_UNIT);

    // Ensure 1st tank wasn't affected
    assertEq(PublicMaterials.BUGS.getTokenBalance(alice), 20 * ONE_UNIT);
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), PublicMaterials.BUGS.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 80 * ONE_UNIT);
  }

  function testRevertInvalidMaterial() public {
    vm.startPrank(alice);

    vm.expectRevert("material does not exist");
    world.fillTank(tanksInPod[0], 1, MaterialId.wrap(bytes14(0)));

    vm.stopPrank();
  }

  function testRevertOtherMaterial() public {
    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 1, PublicMaterials.BUGS);
    vm.expectRevert("tank contains different material");
    world.fillTank(tanksInPod[0], 1, PublicMaterials.AMPHETAMINE);

    vm.stopPrank();
  }

  function testRevertOverTankCapacity() public {
    vm.startPrank(worldAddress);
    PublicMaterials.BUGS.mint(alice, TANK_CAPACITY);
    vm.stopPrank();

    vm.startPrank(alice);

    vm.expectRevert("amount over tank capacity");
    world.fillTank(tanksInPod[0], TANK_CAPACITY / ONE_UNIT + 1, PublicMaterials.BUGS);

    vm.stopPrank();
  }

  function testRevertNoToken() public {
    vm.startPrank(alice);

    vm.expectRevert();
    world.fillTank(tanksInPod[0], 1, PublicMaterials.BLOOD);

    vm.stopPrank();
  }
}
