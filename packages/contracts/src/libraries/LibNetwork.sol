// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import { console } from "forge-std/console.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { GameConfig, GameConfigData, Level, LevelTableId, CarriedBy, TargetPort, Name, CreationBlock, ReadyBlock, EntityType, EntityTypeTableId, Active, ActiveTableId, Rotation, MachineType, LastResolved, MaterialType, Amount } from "../codegen/Tables.sol";
import { ENTITY_TYPE, ROTATION, MATERIAL_TYPE, MACHINE_TYPE, PORT_TYPE } from "../codegen/Types.sol";
import { LibUtils, LibArray, LibBox, LibPort, LibConnection } from "./Libraries.sol";
import { Product } from "../constants.sol";

library LibNetwork {
  function resolve(bytes32 _boxEntity) internal {
    // Abort if box is already resolved
    if (LastResolved.get(_boxEntity) >= block.number) {
      return;
    }
    // @todo: check core energy

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
    Product[] memory inputs = new Product[](machines.length);

    // Counter for the number of stored inputs
    uint32 inputsCount;

    // Outputs for each machine
    Product[] memory outputs = new Product[](machines.length);

    // Counter for the number of stored outputs
    uint32 outputsCount;

    // Iterate until all machines in the network are resolved
    while (resolvedCount < machines.length) {
      console.log("??? TOP OF WHILE LOOP");
      // For each machine in the list
      for (uint i; i < machines.length; i++) {
        console.log("??? TOP OF FOR LOOP");

        // Current node
        bytes32 node = machines[i][0];

        console.log("&&& index");
        console.log(i);

        console.log("$$$ node");
        console.log(uint256(node));

        // Skip if node is already resolved
        if (LibArray.isIdPresent(resolvedNodes, node)) continue;

        console.log("machineType");
        console.log(uint8(MachineType.get(node)));

        // Give inlet an input of pellets...
        if (MachineType.get(node) == MACHINE_TYPE.INLET) {
          inputs[inputsCount] = Product({ machineId: node, materialType: MATERIAL_TYPE.PELLET, amount: 1 });
          inputsCount++;
          console.log("inlet");
          console.log(uint256(inputs[i].machineId));
        }

        // Find input for current node
        Product memory input;
        for (uint k; k < inputsCount; k++) {
          if (inputs[k].machineId == node) {
            input = inputs[k];
            break;
          }
        }

        // Skip if node has no input
        if (input.materialType == MATERIAL_TYPE.NONE) continue;

        console.log("__ processing node:");
        console.log(uint256(node));

        // Mark as resolved
        resolvedNodes[resolvedCount] = node;
        resolvedCount += 1;

        console.log("__ resolvedCount");
        console.log(resolvedCount);

        // Process the inputs of the machine to get the outputs
        // - For now, just double the amount of the input
        outputs[outputsCount] = Product({ machineId: node, materialType: input.materialType, amount: input.amount });
        outputsCount++;

        // 1. Find the machine that is supposed to receive this output

        //  - find the output ports on the current machine
        bytes32[][] memory ports = LibPort.getPorts(node, PORT_TYPE.OUTPUT);

        console.log("... ports.length");
        console.log(ports.length);

        // Only deal with one port for now...
        bytes32 outputPort = ports[0][0];

        console.log("... outputPort");
        console.log(uint256(outputPort));

        // No output port found
        if (outputPort == bytes32(0)) continue;

        //  - find connections going from that port
        bytes32 outgoingConnection = LibConnection.getOutgoing(outputPort);

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

        // 2. Fill the input for that machine with the current output
        inputs[inputsCount] = Product({ machineId: targetEntity, materialType: MATERIAL_TYPE.PELLET, amount: 1 });
        inputsCount++;
      }
      counter += 1;
      console.log("== iteration");
      console.log(counter);
      if (counter == machines.length * 2) {
        return;
      }
    }

    // Get blocks since last resolution
    uint256 blocksSinceLastResolution = block.number - LastResolved.get(_boxEntity);

    for (uint i; i < machines.length; i++) {
      if (MachineType.get(machines[i][0]) == MACHINE_TYPE.OUTLET) {
        console.log("outlet");
        console.log(uint256(machines[i][0]));
        for (uint k; k < outputsCount; k++) {
          if (outputs[k].machineId == machines[i][0]) {
            console.log("=!=!=!=!= output");
            console.log(uint256(outputs[k].materialType));
            console.log(uint256(outputs[k].amount));
            // Write final output(s) to components
            bytes32 materialEntity = LibUtils.getRandomKey();
            EntityType.set(materialEntity, ENTITY_TYPE.MATERIAL);
            CreationBlock.set(materialEntity, block.number);
            MaterialType.set(materialEntity, outputs[k].materialType);
            // Scale by number of blocks since last resolution
            Amount.set(materialEntity, outputs[k].amount * uint32(blocksSinceLastResolution));
          }
        }
      }
    }

    // Set LastResolved on box entity
    LastResolved.set(_boxEntity, block.number);
  }
}
