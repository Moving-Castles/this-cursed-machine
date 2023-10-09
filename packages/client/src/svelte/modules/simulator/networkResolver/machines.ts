import { MachineType, MaterialType } from "../../state/enums"
import type { Product } from "../types"
import { deepClone } from "../../utils/misc"

const EMPTY_PRODUCT: Product = {
  machineId: "",
  materialType: MaterialType.NONE,
  amount: 0,
}

/**
 * Processes the given products based on machine type.
 * @param {MachineType} machineType - Type of machine to process the products.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
export function process(machineType: MachineType, inputs: Product[]) {
  if (inputs.length === 0) return [EMPTY_PRODUCT]
  switch (machineType) {
    case MachineType.CORE:
      return core(inputs)
    case MachineType.OUTLET:
      return outlet(inputs)
    case MachineType.INLET:
      return inlet(inputs)
    case MachineType.SPLITTER:
      return splitter(inputs)
    case MachineType.MIXER:
      return mixer(inputs)
    case MachineType.DRYER:
      return dryer(inputs)
    case MachineType.WETTER:
      return wetter(inputs)
    case MachineType.BOILER:
      return boiler(inputs)
    case MachineType.COOLER:
      return cooler(inputs)
    default:
      return [EMPTY_PRODUCT]
  }
}

/**
 * Processes products through the core machine.
 * Splits a BUG type product into PISS and BLOOD types.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function core(inputs: Product[]): Product[] {
  const outputs: Product[] = new Array(2).fill({});  // Initializing with an empty object

  if (!inputs[0] || inputs[0].materialType !== MaterialType.BUG) return outputs;

  outputs[0] = {
    machineId: inputs[0].machineId,
    materialType: MaterialType.PISS,
    amount: Number(inputs[0].amount) / 2,
  };

  outputs[1] = {
    machineId: inputs[0].machineId,
    materialType: MaterialType.BLOOD,
    amount: Number(inputs[0].amount) / 2,
  };

  return outputs;
};

/**
 * Processes the given products and forwards valid ones to the output.
 * Products with a materialType of NONE are skipped.
 *
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Original list of products, unmodified.
 */
function outlet(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Processes the given products and forwards valid ones to the output.
 * Products with a materialType of NONE are skipped.
 *
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Original list of products, unmodified.
 */
function inlet(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Processes products through the splitter machine.
 * Splits a product into two with half the amount of the original.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function splitter(inputs: Product[]): Product[] {
  const input = inputs[0]

  if (!input) return []

  const halfAmount = Number(input.amount) / 2

  return [
    {
      machineId: input.machineId,
      materialType: input.materialType,
      amount: halfAmount,
    },
    {
      machineId: input.machineId,
      materialType: input.materialType,
      amount: halfAmount,
    },
  ]
}

/**
 * Clones the provided array of Product objects.
 *
 * @function
 * @param {Product[]} inputs - An array of products to be cloned.
 * @returns {Product[]} - A deep clone of the input array.
 */
function mixer(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Clones the provided array of Product objects.
 *
 * @function
 * @param {Product[]} inputs - An array of products to be cloned.
 * @returns {Product[]} - A deep clone of the input array.
 */
function dryer(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Clones the provided array of Product objects.
 *
 * @function
 * @param {Product[]} inputs - An array of products to be cloned.
 * @returns {Product[]} - A deep clone of the input array.
 */
function wetter(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Clones the provided array of Product objects.
 *
 * @function
 * @param {Product[]} inputs - An array of products to be cloned.
 * @returns {Product[]} - A deep clone of the input array.
 */
function boiler(inputs: Product[]): Product[] {
  return deepClone(inputs)
}

/**
 * Clones the provided array of Product objects.
 *
 * @function
 * @param {Product[]} inputs - An array of products to be cloned.
 * @returns {Product[]} - A deep clone of the input array.
 */
function cooler(inputs: Product[]): Product[] {
  return deepClone(inputs)
}
