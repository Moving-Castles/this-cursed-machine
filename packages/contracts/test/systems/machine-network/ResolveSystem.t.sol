// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { BaseTest } from "../../BaseTest.sol";
import "../../../src/codegen/index.sol";
import "../../../src/libraries/Libraries.sol";
import { MACHINE_TYPE, ENTITY_TYPE, PORT_INDEX } from "../../../src/codegen/common.sol";
import { FLOW_RATE } from "../../../src/constants.sol";

contract ResolveSystemTest is BaseTest {
  bytes32 playerEntity;
  bytes32 podEntity;
  bytes32[] inletEntities;
  bytes32 outletEntity;
  bytes32[] tanksInPod;
  FixedEntitiesData fixedEntities;

  function setUp() public override {
    super.setUp();
    vm.startPrank(alice);

    playerEntity = world.spawn("alice");
    world.start();

    podEntity = CarriedBy.get(playerEntity);

    inletEntities = FixedEntities.get(podEntity).inlets;
    outletEntity = FixedEntities.get(podEntity).outlet;

    fixedEntities = FixedEntities.get(podEntity);

    tanksInPod = TanksInPod.get(podEntity);

    vm.stopPrank();
  }

  function checkProcessing(
    uint32 blocksToWait,
    uint32 divisor,
    uint32 initialInletAmount,
    MaterialId inletMaterialId,
    MaterialId expectedOutputMaterialId
  ) internal {
    // Check inlet material type and amount
    uint32 spentInletMaterial = blocksToWait * FLOW_RATE;
    uint32 remainingInletMaterial = LibUtils.safeSubtract(initialInletAmount, spentInletMaterial);

    // Material type is none if there is no remaining material
    assertEq(
      ContainedMaterial.get(tanksInPod[0]).unwrap(),
      remainingInletMaterial == 0 ? LibMaterial.NONE.unwrap() : inletMaterialId.unwrap()
    );
    assertEq(Amount.get(tanksInPod[0]), remainingInletMaterial);

    // Check outlet material type and amount
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), expectedOutputMaterialId.unwrap());
    uint32 producedOutletMaterial = (blocksToWait * FLOW_RATE) / divisor;
    uint32 cappedProducedOutletMaterial = LibUtils.clamp(producedOutletMaterial, (initialInletAmount / divisor));
    assertEq(Amount.get(tanksInPod[1]), cappedProducedOutletMaterial);
  }

  function testResolve() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to outlet
    world.connect(inletEntities[0], outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 5;
    vm.roll(block.number + blocksToWait);

    // Resolve
    startGasReport("Resolve");
    world.resolve();
    endGasReport();

    vm.stopPrank();

    uint32 divisor = 1; // Material loss

    // // Input
    // assertEq(Amount.get(tanksInPod[0]), 15000);
    // // Output
    // assertEq(Amount.get(tanksInPod[1]), 5000);

    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.BUG);
  }

  function testResolveInlet2() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet 1
    world.plugTank(tanksInPod[0], inletEntities[1]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], outletEntity);

    // Connect inlet 1 to outlet
    world.connect(inletEntities[1], outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 5;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    uint32 divisor = 1; // Material loss

    // Input
    // assertEq(Amount.get(tanksInPod[0]), 15000);
    // // Output
    // assertEq(Amount.get(tanksInPod[1]), 5000);

    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.BUG);
  }

  function testMachineProcessingLoss() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 0 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 30;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    uint32 divisor = 2; // Material loss
    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.PISS);
  }

  function testDoubleMachineProcessingLoss() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Build splitter
    bytes32 splitterEntity = world.buildMachine(MACHINE_TYPE.SPLITTER);

    // Connect player (piss) to splitter
    world.connect(playerEntity, splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to outlet
    world.connect(splitterEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 30;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    uint32 divisor = 4; // Material loss
    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.PISS);
  }

  function testCapByTankCapacity() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 500;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    uint32 divisor = 2; // Material loss
    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.PISS);
  }

  function testCapAtInletMaterialAmount() public {
    setUp();

    vm.startPrank(alice);

    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);

    uint32 initialInletAmount = Amount.get(tanksInPod[0]);

    // Connect tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Connect tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Wait
    uint32 blocksToWait = 500;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    uint32 divisor = 2; // Material loss
    checkProcessing(blocksToWait, divisor, initialInletAmount, PublicMaterials.BUG, PublicMaterials.PISS);
  }

  function testLastResolveValueIsUpdated() public {
    setUp();

    vm.startPrank(alice);

    // Wait
    vm.roll(block.number + 10);

    // Attach tank 0 to inlet
    world.plugTank(tanksInPod[0], fixedEntities.inlets[0]);

    // Attach tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Connect inlet to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (piss) to outlet
    world.connect(playerEntity, outletEntity, PORT_INDEX.FIRST);

    // Check that LastResolved was updated
    assertEq(LastResolved.get(podEntity), block.number);

    // * * * * * * * * * * *

    // Wait
    vm.roll(block.number + 10);

    // Detach tank 1 from outlet
    world.unplugTank(tanksInPod[1]);

    // Check that LastResolved was updated
    assertEq(LastResolved.get(podEntity), block.number);

    // * * * * * * * * * * *

    // Wait
    vm.roll(block.number + 10);

    // Attach tank 1 to outlet
    world.plugTank(tanksInPod[1], fixedEntities.outlet);

    // Check that LastResolved was updated
    assertEq(LastResolved.get(podEntity), block.number);

    // * * * * * * * * * * *

    // Wait
    vm.roll(block.number + 10);

    // Disconnect inlet from player
    world.disconnect(inletEntities[0], PORT_INDEX.FIRST);

    // Check that LastResolved was updated
    assertEq(LastResolved.get(podEntity), block.number);

    vm.stopPrank();
  }

  function testResolveMixer() public {
    setUp();

    vm.startPrank(alice);

    // Fill tank 0 with 20000 PublicMaterials.BLOOD
    world.fillTank(tanksInPod[0], 20000, PublicMaterials.BLOOD);
    // Fill tank 1 with 10000 PISS
    world.fillTank(tanksInPod[1], 10000, PublicMaterials.PISS);

    // Connect tank 0 to inlet 0
    world.plugTank(tanksInPod[0], inletEntities[0]);

    // Connect tank 1 to inlet 1
    world.plugTank(tanksInPod[1], inletEntities[1]);

    // Build mixer
    bytes32 mixerEntity = world.buildMachine(MACHINE_TYPE.MIXER);

    // Connect inlet 0 to mixer
    world.connect(inletEntities[0], mixerEntity, PORT_INDEX.FIRST);

    // Connect inlet 1 to mixer
    world.connect(inletEntities[1], mixerEntity, PORT_INDEX.FIRST);

    // Connect mixer to outlet
    world.connect(mixerEntity, outletEntity, PORT_INDEX.FIRST);

    // Connect tank 2 to outlet
    world.plugTank(tanksInPod[2], outletEntity);

    // Wait
    uint32 blocksToWait = 9;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Tank 0 should have 11000 PublicMaterials.BLOOD
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), PublicMaterials.BLOOD.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 11000);

    // Tank 1 should have 1000 PublicMaterials.PISS
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), PublicMaterials.PISS.unwrap());
    assertEq(Amount.get(tanksInPod[1]), 1000);

    // Tank 2 should have 9000 PublicMaterials.HEMATURIC
    assertEq(ContainedMaterial.get(tanksInPod[2]).unwrap(), PublicMaterials.HEMATURIC.unwrap());
    assertEq(Amount.get(tanksInPod[2]), 9000);
  }

  function testResolveSplitterMixer() public {
    setUp();

    vm.startPrank(alice);

    // Fill tank 0 with 20000 PublicMaterials.BLOOD
    world.fillTank(tanksInPod[0], 20000, PublicMaterials.BLOOD);
    // Fill tank 1 with 10000 PISS
    world.fillTank(tanksInPod[1], 10000, PublicMaterials.PISS);

    // Connect tank 0 to inlet 0
    world.plugTank(tanksInPod[0], inletEntities[0]);

    // Connect tank 1 to inlet 1
    world.plugTank(tanksInPod[1], inletEntities[1]);

    // Build mixer
    bytes32 mixerEntity = world.buildMachine(MACHINE_TYPE.MIXER);

    // Build splitter
    bytes32 splitterEntity = world.buildMachine(MACHINE_TYPE.SPLITTER);

    // Connect inlet 0 (blood) to mixer
    world.connect(inletEntities[0], mixerEntity, PORT_INDEX.FIRST);

    // Connect inlet 1 (piss) to splitter
    world.connect(inletEntities[1], splitterEntity, PORT_INDEX.FIRST);

    // Connect splitter to mixer
    world.connect(splitterEntity, mixerEntity, PORT_INDEX.FIRST);

    // Connect mixer to outlet
    world.connect(mixerEntity, outletEntity, PORT_INDEX.FIRST);

    // Connect tank 2 to outlet
    world.plugTank(tanksInPod[2], outletEntity);

    // Wait
    uint32 blocksToWait = 9;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Tank 0 should have 11000 PublicMaterials.BLOOD
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), PublicMaterials.BLOOD.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 11000);

    // Tank 1 should have 1000 PublicMaterials.PISS
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), PublicMaterials.PISS.unwrap());
    assertEq(Amount.get(tanksInPod[1]), 1000);

    // Tank 2 should have 4500 PublicMaterials.HEMATURIC
    assertEq(ContainedMaterial.get(tanksInPod[2]).unwrap(), PublicMaterials.HEMATURIC.unwrap());
    assertEq(Amount.get(tanksInPod[2]), 4500);
  }

  function testUnusedInlet() public {
    setUp();

    vm.startPrank(alice);

    // Fill tank 0 with 20000 PublicMaterials.UREA
    world.fillTank(tanksInPod[0], 20000, PublicMaterials.UREA);
    // Fill tank 1 with 10000 FAT
    world.fillTank(tanksInPod[1], 10000, PublicMaterials.FAT);

    // Connect tank 0 to inlet 0
    world.plugTank(tanksInPod[0], inletEntities[0]);

    // Connect tank 1 to inlet 1
    world.plugTank(tanksInPod[1], inletEntities[1]);

    // Connect inlet 1 (pure fat) to outlet
    world.connect(inletEntities[1], outletEntity, PORT_INDEX.FIRST);

    // Connect tank 2 to outlet
    world.plugTank(tanksInPod[2], outletEntity);

    // Wait
    uint32 blocksToWait = 9;
    vm.roll(block.number + blocksToWait);

    // Resolve
    world.resolve();

    vm.stopPrank();

    // Tank 0 should have 20000 PublicMaterials.UREA
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), PublicMaterials.UREA.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 20000);

    // Tank 1 should have 1000 PublicMaterials.FAT
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), PublicMaterials.FAT.unwrap());
    assertEq(Amount.get(tanksInPod[1]), 1000);

    // Tank 2 should have 9000 PublicMaterials.FAT
    assertEq(ContainedMaterial.get(tanksInPod[2]).unwrap(), PublicMaterials.FAT.unwrap());
    assertEq(Amount.get(tanksInPod[2]), 9000);
  }

  function testOneMixerTwoInlets() public {
    setUp();

    vm.startPrank(alice);

    // Fill tank 0 with 20000 PublicMaterials.BUG
    world.fillTank(tanksInPod[0], 10000, PublicMaterials.BUG);
    // Fill tank 1 with 10000 PublicMaterials.PISS
    world.fillTank(tanksInPod[1], 20000, PublicMaterials.PISS);

    // Connect tank 0 to inlet 0
    world.plugTank(tanksInPod[0], inletEntities[0]);

    // Connect tank 1 to inlet 1
    world.plugTank(tanksInPod[1], inletEntities[1]);

    // Build mixer
    bytes32 mixerEntity = world.buildMachine(MACHINE_TYPE.MIXER);

    // Connect inlet 0 (bugs) to player
    world.connect(inletEntities[0], playerEntity, PORT_INDEX.FIRST);

    // Connect player (blood) to mixer
    world.connect(playerEntity, mixerEntity, PORT_INDEX.SECOND);

    // Connect inlet 1 (piss) to mixer
    world.connect(inletEntities[1], mixerEntity, PORT_INDEX.FIRST);

    // Connect mixer to outlet
    world.connect(mixerEntity, outletEntity, PORT_INDEX.FIRST);

    // Connect tank 2 to outlet
    world.plugTank(tanksInPod[2], outletEntity);

    // Wait
    uint32 blocksToWait = 100;
    vm.roll(block.number + blocksToWait);

    // inletExhaustionBlock = 10000 / 1000 = 10
    // outletFullBlock = 10000 / 500 = 20
    // cappedBlocks = 10;

    // Resolve
    world.resolve();

    vm.stopPrank();

    /*
     *
     *
     */

    // Tank 2 (outlet tank) should have 5000 PublicMaterials.HEMATURIC
    assertEq(ContainedMaterial.get(tanksInPod[2]).unwrap(), PublicMaterials.HEMATURIC.unwrap());
    assertEq(Amount.get(tanksInPod[2]), 5000);

    // Tank 0 should have 0 PublicMaterials.NONE (exhausted)
    assertEq(ContainedMaterial.get(tanksInPod[0]).unwrap(), LibMaterial.NONE.unwrap());
    assertEq(Amount.get(tanksInPod[0]), 0);

    // Tank 1 should have 10000 PublicMaterials.PISS
    assertEq(ContainedMaterial.get(tanksInPod[1]).unwrap(), PublicMaterials.PISS.unwrap());
    assertEq(Amount.get(tanksInPod[1]), 10000);
  }
}
