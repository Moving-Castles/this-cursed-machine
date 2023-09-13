// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, CarriedBy, TargetPort, Name, CreationBlock, ReadyBlock, EntityType, EntityTypeTableId, Active, ActiveTableId, Rotation, MachineType, LastResolved, MaterialType, Amount } from "../codegen/Tables.sol";
import { ENTITY_TYPE, ROTATION, MATERIAL_TYPE, MACHINE_TYPE, PORT_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibArray, LibBox, LibPort, LibConnection, LibMachine } from "./Libraries.sol";
import { Product } from "../constants.sol";

library LibNetwork {
  function resolve(bytes32 _boxEntity) internal {
    // @todo: check core energy

    // Blocks since last resolution
    uint256 blocksSinceLastResolution = block.number - LastResolved.get(_boxEntity);

    // Abort if box is already resolved
    if (blocksSinceLastResolution == 0) return;

    // Counter for the number of iterations over the network
    uint32 counter;

    // Get all machines in the box
    bytes32[][] memory machines = LibBox.getMachinesByBox(_boxEntity);

    console.log("machines.length");
    console.log(machines.length);
    console.log("- - - - - - - -");

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
      console.log("??? TOP OF WHILE LOOP");
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        console.log("??? TOP OF FOR LOOP");

        // Current node
        bytes32 node = machines[i][0];

        console.log("$$$ node");
        console.log(uint256(node));

        // Skip if node is already resolved
        if (LibArray.isIdPresent(resolvedNodes, node)) continue;

        console.log("machineType");
        console.log(uint8(MachineType.get(node)));

        // Give inlet an input of pellets...
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          inputs[inputsCount] = Product({
            machineId: node,
            materialType: MATERIAL_TYPE.PELLET,
            amount: 100,
            temperature: 0
          });
          inputsCount++;
          console.log("inlet");
          console.log(uint256(inputs[i].machineId));
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

        // Skip if node has no input
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

        console.log("... ports.length");
        console.log(ports.length);

        // No output ports were found
        if (ports.length == 0) continue;

        // Fill outputs
        for (uint k; k < ports.length; k++) {
          console.log("... ports[k][0]");
          console.log(uint256(ports[k][0]));

          //  - find connections going from that port
          bytes32 outgoingConnection = LibConnection.getOutgoing(ports[k][0]);

          console.log("... outgoingConnection");
          console.log(uint256(outgoingConnection));

          // No connection
          if (outgoingConnection == bytes32(0)) continue;

          //  - get the port on the other end of the connection
          bytes32 inputPort = TargetPort.get(outgoingConnection);

          //  - get the machine that the port is on
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
      console.log("== iteration");
      console.log(counter);
      if (counter == machines.length * 2) {
        return;
      }
    }

    // Set LastResolved on box entity
    LastResolved.set(_boxEntity, block.number);
  }
}
