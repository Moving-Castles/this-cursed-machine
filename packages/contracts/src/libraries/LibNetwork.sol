// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { CarriedBy, TargetPort, MachineType, LastResolved, MaterialType, Amount, Energy } from "../codegen/index.sol";
import { ENTITY_TYPE, MATERIAL_TYPE, MACHINE_TYPE, PORT_TYPE } from "../codegen/common.sol";
import { LibUtils, LibBox, LibPort, LibConnection, LibMachine } from "./Libraries.sol";
import { Product } from "../constants.sol";

library LibNetwork {
  /**
   * @dev Resolves the state of the entire network inside a given box entity by sequentially processing machines.
   *
   * The function loops through all machines inside a box, checking their types and processing inputs/outputs
   * based on their functionality until all machines in the box have been resolved. For example, an INLET machine
   * will be provided an input if it doesn't have one, while an OUTLET machine will write its outputs to the blockchain.
   * Inputs and outputs between connected machines are properly handled and transferred. The state and outputs
   * of each machine are updated based on its logic and the inputs it receives.
   *
   * @param _boxEntity The entity identifier of the box which contains the network of machines to be resolved.
   */
  function resolve(bytes32 _boxEntity) internal {
    // Blocks since last resolution
    uint256 blocksSinceLastResolution = block.number - LastResolved.get(_boxEntity);

    // Tick down energy for core in box (1 per block)
    tickDownEnergy(_boxEntity, blocksSinceLastResolution);

    // Counter for the number of iterations over the network
    uint32 counter;

    // Get all machines in the box
    bytes32[][] memory machines = LibBox.getMachinesByBox(_boxEntity);

    // console.log("machines.length");
    // console.log(machines.length);
    // console.log("- - - - - - - -");

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
      // console.log("??? TOP OF WHILE LOOP");
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        // console.log("??? TOP OF FOR LOOP");
        // console.log("i");
        // console.log(i);
        // console.log("machines.length");
        // console.log(machines.length);

        // if (machines[i] == bytes32[](0)) continue;

        // Current node
        bytes32 node = machines[i][0];

        // console.log("$$$ node");
        // console.log(uint256(node));

        // Skip if node is already resolved
        if (LibUtils.isIdPresent(resolvedNodes, node)) continue;

        // console.log("machineType");
        // console.log(uint8(MachineType.get(node)));

        // If the machine is an inlet, provide it with bugs as input.
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          inputs[inputsCount] = Product({ machineId: node, materialType: MATERIAL_TYPE.BUG, amount: 100 });
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
        if (currentInputs.length == 0 || currentInputs[0].materialType == MATERIAL_TYPE.NONE) continue;

        // console.log("__ processing node:");
        // console.log(uint256(node));

        // Process the inputs of the machine to get the outputs
        Product[] memory currentOutputs = new Product[](2);
        currentOutputs = LibMachine.process(MachineType.get(node), currentInputs, node, blocksSinceLastResolution);

        // Mark as resolved
        resolvedNodes[resolvedCount] = node;
        resolvedCount += 1;
        // console.log("__ resolvedCount");
        // console.log(resolvedCount);

        // console.log("%%% currentOutputs.length");
        // console.log(currentOutputs.length);

        // If the machine is an outlet, write to chain
        if (MachineType.get(node) == MACHINE_TYPE.OUTLET) {
          for (uint k; k < currentOutputs.length; k++) {
            if (currentOutputs[k].materialType == MATERIAL_TYPE.NONE) continue;
            LibBox.writeOutput(_boxEntity, blocksSinceLastResolution, currentOutputs[k]);
          }
        }

        // Find the output ports on the current machine
        bytes32[][] memory outputPorts = LibPort.getPorts(node, PORT_TYPE.OUTPUT);

        // No output ports were found
        if (outputPorts.length == 0) continue;

        // Distribute the machine's outputs to the connected machines.
        for (uint k; k < outputPorts.length; k++) {
          // console.log("... outputPorts [k][0]");
          // console.log(uint256(outputPorts[k][0]));

          //  Find connections going from that port
          bytes32 outgoingConnection = LibConnection.getOutgoing(outputPorts[k][0]);

          // console.log("... outgoingConnection");
          // console.log(uint256(outgoingConnection));

          // No connection
          if (outgoingConnection == bytes32(0)) continue;

          //  Get the port on the other end of the connection
          bytes32 inputPort = TargetPort.get(outgoingConnection);

          //  Get the machine that the port is on
          bytes32 targetEntity = CarriedBy.get(inputPort);
          // console.log("targetEntity");
          // console.log(uint256(targetEntity));

          // Fill output
          if (currentOutputs[k].materialType != MATERIAL_TYPE.NONE) {
            // console.log("fill output");
            // console.log(inputsCount);
            // console.log(k);
            inputs[inputsCount] = currentOutputs[k];
            // Set the machineId to the target machine
            inputs[inputsCount].machineId = targetEntity;
            inputsCount++;
          }
        }
      }
      // Increment the counter.
      counter += 1;
      // Break out of the loop if it seems like an infinite loop is occurring.
      if (counter == machines.length * 2) {
        LastResolved.set(_boxEntity, block.number);
        return;
      }
    }

    // console.log("????? DONE");

    // Set LastResolved on box entity
    LastResolved.set(_boxEntity, block.number);
  }

  /**
   * @dev Reduces the energy of the core in a given box entity based on elapsed blocks.
   *
   * Ticks down the energy of the core contained in a specific box entity. The energy
   * is reduced by an amount equivalent to `_blocksSinceLastResolution`. If reducing
   * the energy by this amount would result in negative energy, the energy is set to zero.
   *
   * @param _boxEntity The entity identifier of the box containing the core whose energy is to be reduced.
   * @param _blocksSinceLastResolution The number of blocks since the last resolution, indicating the amount to reduce the core’s energy by.
   */
  function tickDownEnergy(bytes32 _boxEntity, uint256 _blocksSinceLastResolution) internal {
    // Tick down energy for core in box (1 per block)
    bytes32[][] memory coreEntities = LibBox.getMachinesOfTypeByBox(_boxEntity, MACHINE_TYPE.CORE);
    uint32 currentEnergy = Energy.get(coreEntities[0][0]);
    if (currentEnergy < uint32(_blocksSinceLastResolution)) {
      Energy.set(coreEntities[0][0], 0);
    } else {
      Energy.set(coreEntities[0][0], currentEnergy - uint32(_blocksSinceLastResolution));
    }
  }
}
