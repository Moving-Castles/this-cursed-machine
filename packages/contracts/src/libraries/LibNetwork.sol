// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { ArrayLib } from "@latticexyz/world-modules/src/modules/utils/ArrayLib.sol";
import { MachineType, LastResolved, MaterialType, OutgoingConnections, MachinesInPod, DepotConnection, FixedEntities, FixedEntitiesData } from "../codegen/index.sol";
import { MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibPod } from "./LibPod.sol";
import { LibMachine } from "./LibMachine.sol";
import { LibDepot } from "./LibDepot.sol";
import { LibUtils } from "./LibUtils.sol";
import { Product, FLOW_RATE } from "../constants.sol";

library LibNetwork {
  struct Counters {
    uint32 iterations; // Number of iterations
    uint32 resolved; // Number of resolved nodes
    uint32 inputs; // Number of stored inputs
  }

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

    // Connected depots.
    // 0 => inlet one depot
    // 1 => inlet two depot
    // 2 => outlet depot
    bytes32[] memory connectedDepots = new bytes32[](3);
    connectedDepots[0] = DepotConnection.get(fixedEntities.inlets[0]);
    connectedDepots[1] = DepotConnection.get(fixedEntities.inlets[1]);
    connectedDepots[2] = DepotConnection.get(fixedEntities.outlet);

    // Abort if neither inlets are connected to depot or if outlet is not connected to depot
    if ((connectedDepots[0] == bytes32(0) && connectedDepots[1] == bytes32(0)) || connectedDepots[2] == bytes32(0)) {
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
          // Is it inlet one or two?
          uint32 depotIndex = node == fixedEntities.inlets[0] ? 0 : 1;
          // Get material from depot
          MATERIAL_TYPE materialType = MaterialType.get(connectedDepots[depotIndex]);

          // Mark as resolved and continue if inlet is empty
          if (materialType == MATERIAL_TYPE.NONE) {
            resolvedNodes[counter.resolved] = node;
            counter.resolved += 1;
            continue;
          }

          inputs[counter.inputs] = Product({
            machineId: node,
            materialType: materialType,
            amount: FLOW_RATE,
            divisor: 0
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
        if (currentInputsCount == 0 || currentInputs[0].materialType == MATERIAL_TYPE.NONE) continue;

        // If this is a mixer and it has less than two inputs:
        // skip without marking as resolved to avoid missing the second input
        if (MachineType.get(node) == MACHINE_TYPE.MIXER && currentInputsCount < 2) continue;

        // Process the inputs of the machine to get the outputs
        Product[] memory currentOutputs = LibMachine.process(MachineType.get(node), currentInputs);

        // Mark as resolved
        resolvedNodes[counter.resolved] = node;
        counter.resolved += 1;

        // Handle outlet
        if (node == fixedEntities.outlet) {
          // Continue if no output
          if (currentOutputs[0].materialType == MATERIAL_TYPE.NONE) continue;
          // Write to depot
          LibDepot.write(
            connectedDepots[0],
            connectedDepots[2],
            block.number - LastResolved.get(_podEntity), // Blocks since last resolved
            currentOutputs[0]
          );
          // Once we have written to output we are done
          // Update LastResolved on pod entity
          LastResolved.set(_podEntity, block.number);
          return;
        }

        // Get outgoing connections from the machine
        bytes32[] memory outgoingConnectTargets = OutgoingConnections.get(node);

        // If the machine has no outgoing connections, mark as resolved and continue
        if (outgoingConnectTargets.length == 0) {
          resolvedNodes[counter.resolved] = node;
          counter.resolved += 1;
          continue;
        }

        // Distribute the machine's outputs to the connected machines.
        for (uint k; k < outgoingConnectTargets.length; k++) {
          if (currentOutputs[k].materialType != MATERIAL_TYPE.NONE) {
            inputs[counter.inputs] = currentOutputs[k];
            // Set the machineId to the target machine
            inputs[counter.inputs].machineId = outgoingConnectTargets[k];
            counter.inputs++;
          }
        }
      }
      counter.iterations += 1;
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
