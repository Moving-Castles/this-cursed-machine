// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";
import { MachineType, LastResolved, ContainedMaterial, OutgoingConnections, MachinesInPod, TankConnection, FixedEntities, FixedEntitiesData, BuildIndex } from "../codegen/index.sol";
import { MACHINE_TYPE } from "../codegen/common.sol";
import { LibPod } from "./LibPod.sol";
import { LibMachine } from "./LibMachine.sol";
import { LibTank } from "./LibTank.sol";
import { LibMaterial, MaterialId } from "./LibMaterial.sol";
import { FLOW_RATE } from "../constants.sol";
import { Product } from "../structs.sol";

library LibNetwork {
  struct Counters {
    uint32 iterations; // Number of iterations of the outer loop
    uint32 resolved; // Number of resolved nodes
    uint32 inputs; // Number of stored inputs
  }

  /**
   * @notice Resolve the network in a pod
   * @dev The outcome of this function is to update the tanks in the pod
   * @param _podEntity The id of the pod entity
   */
  function resolve(bytes32 _podEntity) internal {
    // All counters grouped as a struct
    Counters memory counter;

    // Get all machines in the pod
    bytes32[] memory machines = MachinesInPod.get(_podEntity);

    // List to keep track of nodes (machines) that have processed their inputs
    bytes32[] memory resolvedNodes = new bytes32[](machines.length);

    // Inputs for machines
    Product[] memory inputs = new Product[](machines.length * 2);

    FixedEntitiesData memory fixedEntities = FixedEntities.get(_podEntity);

    // Connected tanks.
    // 0 => inlet one tank
    // 1 => inlet two tank
    // 2 => outlet tank
    bytes32[] memory connectedTanks = new bytes32[](3);
    connectedTanks[0] = TankConnection.get(fixedEntities.inlets[0]);
    connectedTanks[1] = TankConnection.get(fixedEntities.inlets[1]);
    connectedTanks[2] = TankConnection.get(fixedEntities.outlet);

    // Abort if neither inlets are connected to tank or if outlet is not connected to tank
    if ((connectedTanks[0] == bytes32(0) && connectedTanks[1] == bytes32(0)) || connectedTanks[2] == bytes32(0)) {
      LastResolved.set(_podEntity, block.number);
      return;
    }

    // Iterate until all machines in the network are resolved
    while (counter.resolved < machines.length) {
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        // Current node
        bytes32 node = machines[i];

        // Skip if node is already resolved
        if (ArrayLib.includes(resolvedNodes, node)) continue;

        // Handle inlets
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          // Get material from tank
          uint tankIndex = BuildIndex.get(node) - 1;
          MaterialId materialId = ContainedMaterial.get(connectedTanks[tankIndex]);

          // Mark as resolved and continue if inlet is empty
          if (!materialId.isRegistered()) {
            resolvedNodes[counter.resolved] = node;
            counter.resolved++;
            continue;
          }

          bool[2] memory newInletActive;
          // Set active for inlet
          newInletActive[tankIndex] = true;

          inputs[counter.inputs] = Product({
            machineId: node,
            materialId: materialId,
            amount: FLOW_RATE,
            inletActive: newInletActive
          });
          counter.inputs++;
        }

        // Gather all the inputs for the current machine.
        uint currentInputsCount;
        Product[] memory currentInputs = new Product[](2);
        for (uint k; k < counter.inputs; k++) {
          if (inputs[k].machineId == node) {
            currentInputs[currentInputsCount] = inputs[k];
            currentInputsCount++;
            // There should never be more than 2 inputs...
            if (currentInputsCount == 2) break;
          }
        }

        // Skip if node has no input
        if (currentInputsCount == 0 || !currentInputs[0].materialId.isRegistered()) continue;

        // If this is a mixer and it has less than two inputs:
        // skip without marking as resolved to avoid missing the second input
        if (MachineType.get(node) == MACHINE_TYPE.MIXER && currentInputsCount < 2) continue;

        // Process the inputs of the machine to get the outputs
        Product[] memory currentOutputs = LibMachine.process(MachineType.get(node), currentInputs);

        // Mark as resolved
        resolvedNodes[counter.resolved] = node;
        counter.resolved++;

        // Handle outlet
        if (node == fixedEntities.outlet) {
          // Continue if no output
          if (!currentOutputs[0].materialId.isRegistered()) continue;
          // Write to tank
          LibTank.write(
            [connectedTanks[0], connectedTanks[1]],
            connectedTanks[2],
            block.number - LastResolved.get(_podEntity), // Blocks since last resolved
            currentOutputs[0]
          );
          // Once we have written to output we are done
          LastResolved.set(_podEntity, block.number);
          return;
        }

        // Get outgoing connections from the machine
        bytes32[] memory outgoingConnectTargets = OutgoingConnections.get(node);

        // If the machine has no outgoing connections, mark as resolved and continue
        if (outgoingConnectTargets.length == 0) {
          resolvedNodes[counter.resolved] = node;
          counter.resolved++;
          continue;
        }

        // Distribute the machine's outputs to the connected machines.
        for (uint k; k < outgoingConnectTargets.length; k++) {
          if (k >= currentOutputs.length) {
            // Stop if outputs for the remaining outgoing connections are absent
            break;
          }
          if (currentOutputs[k].materialId.isRegistered()) {
            Product memory newProduct = Product({
              machineId: outgoingConnectTargets[k],
              materialId: currentOutputs[k].materialId,
              amount: currentOutputs[k].amount,
              inletActive: currentOutputs[k].inletActive
            });
            inputs[counter.inputs] = newProduct;
            counter.inputs++;
          }
        }
      }
      counter.iterations++;
      // Break out of the loop if it seems like an infinite loop is occurring.
      if (counter.iterations == machines.length * 2) {
        LastResolved.set(_podEntity, block.number);
        return;
      }
    }

    // Update LastResolved on pod entity
    LastResolved.set(_podEntity, block.number);
  }
}
