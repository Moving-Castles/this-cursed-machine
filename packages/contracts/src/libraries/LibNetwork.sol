// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;
import { console } from "forge-std/console.sol";
import { CarriedBy, MachineType, LastResolved, MaterialType, Amount, OutgoingConnections, MachinesInPod, StorageConnection, FixedEntities, FixedEntitiesData } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibMachine, LibStorage } from "./Libraries.sol";
import { Product } from "../constants.sol";

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

    // Connected storages.
    // 0 => inlet one storage
    // 1 => inlet two storage
    // 2 => outlet storage
    bytes32[] memory connectedStorages = new bytes32[](3);
    connectedStorages[0] = StorageConnection.get(fixedEntities.inlets[0]);
    connectedStorages[1] = StorageConnection.get(fixedEntities.inlets[1]);
    connectedStorages[2] = StorageConnection.get(fixedEntities.outlet);

    // Abort if neither inlets are connected to storage or if outlet is not connected to storage
    if (
      (connectedStorages[0] == bytes32(0) && connectedStorages[1] == bytes32(0)) || connectedStorages[2] == bytes32(0)
    ) return;

    // Iterate until all machines in the network are resolved
    while (counter.resolved < machines.length) {
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        // console.log("resolvedNodes");
        // console.log("*******");
        // for (uint j; j < resolvedNodes.length; j++) {
        //   console.logBytes32(resolvedNodes[j]);
        // }
        // console.log("*******");

        // Current node
        bytes32 node = machines[i];

        // Skip if node is already resolved
        if (LibUtils.isIdPresent(resolvedNodes, node)) continue;

        // console.log("==== unresolved node");
        // console.logBytes32(node);
        // console.log(uint32(MachineType.get(node)));

        // Handle inlets
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          // Is it inlet one or two
          uint32 storageIndex = node == fixedEntities.inlets[0] ? 0 : 1;
          // Get material from storage
          MATERIAL_TYPE materialType = MaterialType.get(connectedStorages[storageIndex]);

          // Mark as resolved and abort if no material
          if (materialType == MATERIAL_TYPE.NONE) {
            resolvedNodes[counter.resolved] = node;
            counter.resolved += 1;
            continue;
          }

          inputs[counter.inputs] = Product({ machineId: node, materialType: materialType, amount: 100, factor: 0 });
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
        Product[] memory currentOutputs = new Product[](2);
        currentOutputs = LibMachine.process(MachineType.get(node), currentInputs);

        // Mark as resolved
        resolvedNodes[counter.resolved] = node;
        counter.resolved += 1;

        // If the machine is the outlet, write to storage
        if (node == fixedEntities.outlet) {
          // Continue if no output
          if (currentOutputs[0].materialType == MATERIAL_TYPE.NONE) continue;
          // Write to storage
          LibStorage.writeToStorage(
            connectedStorages[0],
            connectedStorages[2],
            block.number - LastResolved.get(_podEntity), // Blocks since last resolved
            currentOutputs[0]
          );
          // Once we have written to output we are done
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
          // Fill output
          if (currentOutputs[k].materialType != MATERIAL_TYPE.NONE) {
            inputs[counter.inputs] = currentOutputs[k];
            // Set the machineId to the target machine
            inputs[counter.inputs].machineId = outgoingConnectTargets[k];
            counter.inputs++;
          }
        }
      }
      // Increment the counter.
      counter.iterations += 1;
      // Break out of the loop if it seems like an infinite loop is occurring.
      if (counter.iterations == machines.length * 2) {
        LastResolved.set(_podEntity, block.number);
        return;
      }
    }

    // Set LastResolved on pod entity
    LastResolved.set(_podEntity, block.number);
  }
}
