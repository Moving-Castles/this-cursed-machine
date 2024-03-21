import { MACHINE_TYPE, MATERIAL_TYPE } from "../base/enums"
import type { Product } from "./patches/types"
import { deepClone, getUniqueIdentifier } from "../../utils"

const EMPTY_PRODUCT: Product = {
  machineId: "",
  materialType: MATERIAL_TYPE.NONE,
  amount: 0,
  inletActive: [false, false]
}

/**
 * Processes a list of products based on the specified machine type. It delegates processing to specialized
 * functions based on the machine type provided.
 *
 * - If `machineType` is PLAYER, the `player` function is used.
 * - If `machineType` is SPLITTER, the `splitter` function is used.
 * - If `machineType` is MIXER, the `mixer` function is used.
 * - If `machineType` is DRYER, BOILER, CENTRIFUGE, GRINDER, RAT_CAGE, or MEALWORM_VAT, the `simpleMachine` function is used.
 * - For MACHINE_TYPE.NONE, MACHINE_TYPE.INLET, and MACHINE_TYPE.OUTLET, the products are deeply cloned and returned as is.
 *
 * @param {MACHINE_TYPE} machineType - The type of machine used for processing.
 * @param {Product[]} inputs - An array of products to be processed.
 * @returns {Product[]} An array containing the processed products.
 */
export function process(machineType: MACHINE_TYPE, inputs: Product[], recipes: Recipe[]): Product[] {
  if (inputs.length === 0) return [EMPTY_PRODUCT]
  if (machineType === MACHINE_TYPE.PLAYER) {
    return player(inputs)
  } else if (machineType === MACHINE_TYPE.SPLITTER) {
    return splitter(inputs)
  } else if (machineType === MACHINE_TYPE.MIXER) {
    return mixer(recipes, inputs)
  } else if (
    machineType >= MACHINE_TYPE.DRYER
  ) {
    return simpleMachine(recipes, machineType, inputs)
  }
  // Default (MACHINE_TYPE.NONE, MACHINE_TYPE.INLET and MACHINE_TYPE.OUTLET)
  return deepClone(inputs)
}

/**
 * Processes the first product from the input array. If its material type is BUG, it splits the product into two products
 * with half the amount: one of material type PISS and the other of material type BLOOD.
 * If the input array is empty or the material type is not BUG, it returns an array of two empty products.
 *
 * @param {Product[]} inputs - An array of products, where each product has properties: machineId, materialType, and amount.
 * @returns {Product[]} An array containing two products. If the first input product's materialType is BUG, the output contains
 * a product of type PISS and another of type BLOOD. Otherwise, two empty products are returned.
 */
function player(inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT] // Initializing with two distinct empty objects

  const input = inputs[0]

  // Abort if input is not bug
  if (input.materialType != MATERIAL_TYPE.BUG) return outputs;

  const halfAmount = Number(input.amount) / 2

  outputs[0] = {
    machineId: input.machineId,
    materialType: MATERIAL_TYPE.PISS,
    amount: halfAmount,
    inletActive: input.inletActive
  }

  outputs[1] = {
    machineId: input.machineId,
    materialType: MATERIAL_TYPE.BLOOD,
    amount: halfAmount,
    inletActive: input.inletActive
  }

  return outputs
}

/**
 * Splits the first product from the input array into two products with half the amount.
 * If the input array is empty, it returns an array of two empty products.
 *
 * @param {Product[]} inputs - An array of products, where each product has properties: machineId, materialType, and amount.
 * @returns {Product[]} An array containing two products with the same machineId and materialType as the first product from the input array, but with half the amount.
 */
function splitter(inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT] // Initializing with two distinct empty objects

  const input = inputs[0]

  if (!input) return outputs

  const halfAmount = Number(input.amount) / 2

  outputs[0] = {
    machineId: input.machineId,
    materialType: input.materialType,
    amount: halfAmount,
    inletActive: input.inletActive
  }

  outputs[1] = {
    machineId: input.machineId,
    materialType: input.materialType,
    amount: halfAmount,
    inletActive: input.inletActive
  }

  return outputs
}

/**
 * Processes the input products using a mixer machine to generate a combined product.
 *
 * @notice The function checks a list of predefined recipes to determine the output product's material type based on the material types of the input products. If a matching recipe is found, the output product is created using the machine ID of the first input product and the specified amount. If no matching recipe is found, the output material type is set to `MATERIAL_TYPE.NONE`.
 * @param {Product[]} inputs - An array of input products to be processed by the mixer. The array should contain exactly two products for a successful mixing process.
 * @returns {Product[]} An array containing the processed product. If the input does not meet the requirements or no matching recipe is found, it returns an array with an empty product.
 */
function mixer(recipes: Recipe[], inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT] // Initializing with two distinct empty objects

  if (inputs.length !== 2) return outputs

  const outputMaterial = getRecipe(recipes, MACHINE_TYPE.MIXER, getUniqueIdentifier(Number(inputs[0].materialType), Number(inputs[1].materialType)))

  const lowestAmountProduct = getLowestAmountProduct(inputs[0], inputs[1])

  const combinedInletActive = [
    inputs[0].inletActive[0] || inputs[1].inletActive[0],
    inputs[0].inletActive[1] || inputs[1].inletActive[1]
  ]

  outputs[0] = {
    machineId: inputs[0].machineId,
    materialType: outputMaterial,
    amount: lowestAmountProduct.amount,
    inletActive: combinedInletActive
  }

  return outputs
}

/**
 * Processes the input products using a specified simple machine to generate an output product.
 *
 * @notice The function checks a list of predefined recipes to determine the output product's material type based on the material type of the input product and the specified machine type. If a matching recipe is found, the output product is created using the machine ID of the input product and its amount. If no matching recipe is found, the output material type is set to `MATERIAL_TYPE.NONE`.
 * @param {MACHINE_TYPE} machineType - The type of simple machine used for processing.
 * @param {Product[]} inputs - An array of input products to be processed. The function primarily checks the first product in the array.
 * @returns {Product[]} An array containing the processed product. If the input does not meet the requirements or no matching recipe is found, it returns an array with an empty product.
 */
function simpleMachine(recipes: Recipe[], machineType: MACHINE_TYPE, inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT] // Initializing with two distinct empty objects

  const input = inputs[0]

  if (!input) return outputs

  const outputMaterial = getRecipe(recipes, machineType, Number(inputs[0].materialType))

  outputs[0] = {
    machineId: input.machineId,
    materialType: outputMaterial,
    amount: input.amount,
    inletActive: input.inletActive
  }

  return outputs
}

function getLowestAmountProduct(A: Product, B: Product): Product {
  return A.amount < B.amount ? A : B
}

function getRecipe(recipes: Recipe[], machineType: MACHINE_TYPE, input: number): MATERIAL_TYPE {
  return recipes.find(recipe => recipe.machineType === machineType &&
    recipe.input === input
  )?.output || MATERIAL_TYPE.NONE
}
