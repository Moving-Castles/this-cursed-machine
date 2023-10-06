// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, CarriedBy, TargetPort, Name, CreationBlock, ReadyBlock, EntityType, EntityTypeTableId, MachineType, LastResolved, MaterialType, Amount, Energy } from "../codegen/index.sol";
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

    // Abort if box is already resolved
    // if (blocksSinceLastResolution == 0) return;

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

    // Inputs for each machine
    Product[] memory inputs = new Product[](machines.length * 2);

    // Counter for the number of stored inputs
    uint32 inputsCount;

    // Iterate until all machines in the network are resolved
    while (resolvedCount < machines.length) {
      // console.log("??? TOP OF WHILE LOOP");
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        // console.log("??? TOP OF FOR LOOP");

        // Current node
        bytes32 node = machines[i][0];

        // console.log("$$$ node");
        // console.log(uint256(node));

        // Skip if node is already resolved
        if (LibUtils.isIdPresent(resolvedNodes, node)) continue;

        // console.log("machineType");
        // console.log(uint8(MachineType.get(node)));

        // Give inlet an input of bugs...
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          inputs[inputsCount] = Product({ machineId: node, materialType: MATERIAL_TYPE.BUG, amount: 100 });
          inputsCount++;
          // console.log("inlet");
          // console.log(uint256(inputs[i].machineId));
        }

        // There are never more than 2 inputs...
        uint currentInputsCount;
        Product[] memory currentInputs = new Product[](2);
        // Find all inputs for current node
        for (uint k; k < inputsCount; k++) {
          if (inputs[k].machineId == node) {
            currentInputs[currentInputsCount] = inputs[k];
            currentInputsCount++;
          }
        }

        // Skip if node has no input and is not a core
        // (Energy level of cores tick down even if not connected...)
        // && MachineType.get(node) != MACHINE_TYPE.CORE
        if (currentInputs[0].materialType == MATERIAL_TYPE.NONE) continue;

        console.log("__ processing node:");
        console.log(uint256(node));

        // Mark as resolved
        resolvedNodes[resolvedCount] = node;
        resolvedCount += 1;

        console.log("__ resolvedCount");
        console.log(resolvedCount);

        // Process the inputs of the machine to get the outputs
        Product[] memory currentOutputs = new Product[](2);
        currentOutputs = LibMachine.process(MachineType.get(node), currentInputs, node, blocksSinceLastResolution);

        console.log("%%% currentOutputs.length");
        console.log(currentOutputs.length);

        // If the machine is an outlet, write to chain
        if (MachineType.get(node) == MACHINE_TYPE.OUTLET) {
          for (uint k; k < currentOutputs.length; k++) {
            if (currentOutputs[k].materialType == MATERIAL_TYPE.NONE) continue;
            LibBox.writeOutput(_boxEntity, blocksSinceLastResolution, currentOutputs[k]);
          }
        }

        //  - find the output ports on the current machine
        bytes32[][] memory ports = LibPort.getPorts(node, PORT_TYPE.OUTPUT);

        console.log("INTERNAL RESOLVER");
        console.log("ports.length");
        console.log(ports.length);

        // No output ports were found
        if (ports.length == 0) continue;

        // Fill outputs
        for (uint k; k < ports.length; k++) {
          console.log("... ports[k][0]");
          console.log(uint256(ports[k][0]));

          //  Find connections going from that port
          bytes32 outgoingConnection = LibConnection.getOutgoing(ports[k][0]);

          console.log("... outgoingConnection");
          console.log(uint256(outgoingConnection));

          // No connection
          if (outgoingConnection == bytes32(0)) continue;

          //  Get the port on the other end of the connection
          bytes32 inputPort = TargetPort.get(outgoingConnection);

          //  Get the machine that the port is on
          bytes32 targetEntity = CarriedBy.get(inputPort);
          console.log("targetEntity");
          console.log(uint256(targetEntity));

          // Fill output
          if (currentOutputs[k].materialType != MATERIAL_TYPE.NONE) {
            inputs[inputsCount] = currentOutputs[k];
            // !!! Set the machineId to the target machine
            inputs[inputsCount].machineId = targetEntity;
            inputsCount++;
          }
        }
      }
      // ...
      counter += 1;
      // console.log("== iteration");
      // console.log(counter);
      if (counter == machines.length * 2) {
        // Set LastResolved on box entity
        LastResolved.set(_boxEntity, block.number);
        return;
      }
    }

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
    bytes32[][] memory coreEntities = LibBox.getCoresByBox(_boxEntity);
    if (Energy.get(coreEntities[0][0]) < uint32(_blocksSinceLastResolution)) {
      Energy.set(coreEntities[0][0], 0);
    } else {
      Energy.set(coreEntities[0][0], Energy.get(coreEntities[0][0]) - uint32(_blocksSinceLastResolution));
    }
  }
}
