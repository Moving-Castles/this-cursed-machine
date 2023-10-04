import { MachineType, MaterialType } from "../../state/enums"
import type { Product } from "../types"
import { deepClone } from "../../utils/misc"

const EMPTY_PRODUCT: Product = {
  machineId: "",
  materialType: MaterialType.NONE,
  amount: 0,
  temperature: 0,
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
    case MachineType.SCORCHER:
      return scorcher(inputs)
    case MachineType.SPLITTER:
      return splitter(inputs)
    case MachineType.BLENDER:
      return blender(inputs)
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
  const outputs: Product[] = new Array(2).fill({}) // Initializing with an empty object

  const input = inputs[0]

  if (!input) return []

  if (input.materialType !== MaterialType.BUG) return outputs

  outputs[0] = {
    machineId: input.machineId,
    materialType: MaterialType.PISS,
    amount: Number(input.amount) / 2,
    temperature: input.temperature,
  }

  outputs[1] = {
    machineId: input.machineId,
    materialType: MaterialType.BLOOD,
    amount: Number(input.amount) / 2,
    temperature: input.temperature,
  }

  return outputs
}

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
 * Processes products through the scorcher machine.
 * Increases the temperature of the product by 30.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function scorcher(inputs: Product[]): Product[] {
  return [
    {
      machineId: inputs[0].machineId,
      materialType: inputs[0].materialType,
      amount: Number(inputs[0].amount),
      temperature: inputs[0].temperature + 30,
    },
  ]
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
      temperature: input.temperature,
    },
    {
      machineId: input.machineId,
      materialType: input.materialType,
      amount: halfAmount,
      temperature: input.temperature,
    },
  ]
}

/**
 * Processes products through the blender machine.
 * Combines BLOOD and PISS types to produce a TEETH type.
 * @param {Product[]} inputs - Array of products to process.
 * @returns {Product[]} - Processed list of products.
 */
function blender(inputs: Product[]): Product[] {
  const input1 = inputs[0]
  const input2 = inputs[1]

  if (!input1 || !input2) return []

  let materialType = MaterialType.DIRT

  if (
    (input1.materialType === MaterialType.BLOOD &&
      input2.materialType === MaterialType.PISS) ||
    (input1.materialType === MaterialType.PISS &&
      input2.materialType === MaterialType.BLOOD)
  ) {
    materialType = MaterialType.TEETH
  }

  return [
    {
      machineId: input1.machineId,
      materialType: materialType,
      amount: Number(input1.amount),
      temperature: input1.temperature,
    },
  ]
}
