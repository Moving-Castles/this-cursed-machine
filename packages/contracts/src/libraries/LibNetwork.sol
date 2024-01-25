// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { CarriedBy, MachineType, LastResolved, MaterialType, Amount, OutgoingConnections, MachinesInPod, StorageConnection } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE } from "../codegen/common.sol";
import { LibUtils, LibPod, LibMachine, LibStorage } from "./Libraries.sol";
import { Product } from "../constants.sol";

library LibNetwork {
  /**
   * @dev Resolves the state of the entire network inside a given pod entity by sequentially processing machines.
   *
   * The function loops through all machines inside a pod, checking their types and processing inputs/outputs
   * based on their functionality until all machines in the pod have been resolved. For example, an INLET machine
   * will be provided an input if it doesn't have one, while an OUTLET machine will write its outputs to the blockchain.
   * Inputs and outputs between connected machines are properly handled and transferred. The state and outputs
   * of each machine are updated based on its logic and the inputs it receives.
   *
   * @param _playerEntity The entity identifier of the player machine in the pod.
   */
  function resolve(bytes32 _playerEntity) internal {
    // Get pod entity
    bytes32 podEntity = CarriedBy.get(_playerEntity);

    // Blocks since last resolution
    uint256 blocksSinceLastResolution = block.number - LastResolved.get(podEntity);

    // Counter for the number of iterations over the network
    uint32 counter;

    // Get all machines in the pod
    bytes32[] memory machines = MachinesInPod.get(podEntity);

    // List to keep track of nodes (machines) that have processed their inputs
    bytes32[] memory resolvedNodes = new bytes32[](machines.length);

    // Counter for the number of resolved nodes
    uint32 resolvedCount;

    // Inputs for machines
    Product[] memory inputs = new Product[](machines.length * 2);

    // Counter for the number of stored inputs
    uint32 inputsCount;

    // Iterate until all machines in the network are resolved
    while (resolvedCount < machines.length) {
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        // Current node
        bytes32 node = machines[i];

        // Skip if node is already resolved
        if (LibUtils.isIdPresent(resolvedNodes, node)) continue;

        // If the machine is an inlet, get material from connected storage
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          // Get connected storage
          bytes32 storageEntity = StorageConnection.get(node);
          // Abort if not connected
          if (storageEntity == bytes32(0)) return;
          // Currently have a rate of 100 units per block
          inputs[inputsCount] = Product({
            machineId: node,
            materialType: MaterialType.get(storageEntity),
            amount: 100
          });
          inputsCount++;
        }

        // Gather all the inputs for the current machine.
        uint currentInputsCount;
        Product[] memory currentInputs = new Product[](2);
        for (uint k; k < inputsCount; k++) {
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
        resolvedNodes[resolvedCount] = node;
        resolvedCount += 1;

        // If the machine is an outlet, write to storage
        if (MachineType.get(node) == MACHINE_TYPE.OUTLET) {
          // Abort if not connected
          bytes32 storageEntity = StorageConnection.get(node);
          if (storageEntity == bytes32(0)) return;
          // Continue if no output
          if (currentOutputs[0].materialType == MATERIAL_TYPE.NONE) continue;
          // Write to storage
          LibStorage.writeToStorage(storageEntity, blocksSinceLastResolution, currentOutputs[0]);
        }

        // Get outgoing connections from the machine
        bytes32[] memory outgoingConnectTargets = OutgoingConnections.get(node);

        // Distribute the machine's outputs to the connected machines.
        for (uint k; k < outgoingConnectTargets.length; k++) {
          // Fill output
          if (currentOutputs[k].materialType != MATERIAL_TYPE.NONE) {
            inputs[inputsCount] = currentOutputs[k];
            // Set the machineId to the target machine
            inputs[inputsCount].machineId = outgoingConnectTargets[k];
            inputsCount++;
          }
        }
      }
      // Increment the counter.
      counter += 1;
      // Break out of the loop if it seems like an infinite loop is occurring.
      if (counter == machines.length * 2) {
        LastResolved.set(podEntity, block.number);
        return;
      }
    }

    // Set LastResolved on pod entity
    LastResolved.set(podEntity, block.number);
  }
}
