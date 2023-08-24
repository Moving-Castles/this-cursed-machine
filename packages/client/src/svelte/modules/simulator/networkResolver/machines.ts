import { MachineType, MaterialType } from "../../state/enums";
import type { Product } from "..";
import { addOutput } from "..";


/**
 * Processes the given products based on machine type.
 * @param {MachineType} machineType - Type of machine to process the products.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
export function process(machineType: MachineType, inputs: Product[]) {
    switch (machineType) {
        case MachineType.CORE:
            return core(inputs);
        case MachineType.OUTLET:
            return outlet(inputs);
        case MachineType.SCORCHER:
            return scorcher(inputs);
        case MachineType.SPLITTER:
            return splitter(inputs);
        case MachineType.BLENDER:
            return blender(inputs);
        default:
            return inputs;
    }
}

/**
 * Processes products through the core machine.
 * Splits a PELLET type product into PISS and BLOOD types.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function core(inputs: Product[]): Product[] {
    const outputs: Product[] = new Array(2).fill({});  // Initializing with an empty object

    if (inputs[0].materialType !== MaterialType.PELLET) return outputs;

    outputs[0] = {
        machineId: inputs[0].machineId,
        materialType: MaterialType.PISS,
        amount: inputs[0].amount / 2,
        temperature: inputs[0].temperature
    };

    outputs[1] = {
        machineId: inputs[0].machineId,
        materialType: MaterialType.BLOOD,
        amount: inputs[0].amount / 2,
        temperature: inputs[0].temperature
    };

    return outputs;
}

/**
 * Processes the given products and forwards valid ones to the output.
 * Products with a materialType of NONE are skipped.
 * 
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Original list of products, unmodified.
 */
function outlet(inputs: Product[]): Product[] {
    for (let k = 0; k < inputs.length; k++) {
        if (inputs[k].materialType && inputs[k].materialType !== MaterialType.NONE) {
            addOutput(inputs[k]);
        }
    }
    return inputs;
}

/**
 * Processes products through the scorcher machine.
 * Increases the temperature of the product by 30.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function scorcher(inputs: Product[]): Product[] {
    return [{
        machineId: inputs[0].machineId,
        materialType: inputs[0].materialType,
        amount: inputs[0].amount,
        temperature: inputs[0].temperature + 30
    }];
}

/**
 * Processes products through the splitter machine.
 * Splits a product into two with half the amount of the original.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function splitter(inputs: Product[]): Product[] {
    const halfAmount = inputs[0].amount / 2;

    return [
        {
            machineId: inputs[0].machineId,
            materialType: inputs[0].materialType,
            amount: halfAmount,
            temperature: inputs[0].temperature
        },
        {
            machineId: inputs[0].machineId,
            materialType: inputs[0].materialType,
            amount: halfAmount,
            temperature: inputs[0].temperature
        }
    ];
}

/**
 * Processes products through the blender machine.
 * Combines BLOOD and PISS types to produce a TEETH type.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function blender(inputs: Product[]): Product[] {
    let materialType = MaterialType.DIRT;

    if ((inputs[0].materialType === MaterialType.BLOOD && inputs[1].materialType === MaterialType.PISS) ||
        (inputs[0].materialType === MaterialType.PISS && inputs[1].materialType === MaterialType.BLOOD)) {
        materialType = MaterialType.TEETH;
    }

    return [{
        machineId: inputs[0].machineId,
        materialType: materialType,
        amount: inputs[0].amount,
        temperature: inputs[0].temperature
    }];
}