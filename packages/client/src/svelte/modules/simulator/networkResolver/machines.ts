import { get } from "svelte/store"
import { recipes } from "../../state"
import { MachineType, MaterialType } from "../../state/enums"
import type { Product } from "../types"
import { deepClone, getUniqueIdentifier } from "../../utils/misc"

const EMPTY_PRODUCT: Product = {
  machineId: "",
  materialType: MaterialType.NONE,
  amount: 0,
}

/**
 * Processes a list of products based on the specified machine type. It delegates processing to specialized
 * functions based on the machine type provided.
 * 
 * - If `machineType` is CORE, the `core` function is used.
 * - If `machineType` is SPLITTER, the `splitter` function is used.
 * - If `machineType` is MIXER, the `mixer` function is used.
 * - For machine types between DRYER and COOLER (inclusive), the `simpleMachine` function is used.
 * - For MachineType.NONE, MachineType.INLET, and MachineType.OUTLET, the products are deeply cloned and returned as is.
 * 
 * @param {MachineType} machineType - The type of machine used for processing.
 * @param {Product[]} inputs - An array of products to be processed.
 * @returns {Product[]} An array containing the processed products.
 */
export function process(machineType: MachineType, inputs: Product[]) {
  if (inputs.length === 0) return [EMPTY_PRODUCT]
  if (machineType === MachineType.CORE) {
    return core(inputs)
  } else if (machineType === MachineType.SPLITTER) {
    return splitter(inputs)
  } else if (machineType === MachineType.MIXER) {
    return mixer(inputs)
  } else if (machineType >= MachineType.DRYER && machineType <= MachineType.COOLER) {
    return simpleMachine(machineType, inputs)
  }
  // Default (MachineType.NONE, MachineType.INLET and MachineType.OUTLET)
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
function core(inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT];  // Initializing with two distinct empty objects

  const input = inputs[0]

  if (!input || input.materialType !== MaterialType.BUG) return outputs;

  const halfAmount = Number(input.amount) / 2

  outputs[0] = {
    machineId: input.machineId,
    materialType: MaterialType.PISS,
    amount: halfAmount
  };

  outputs[1] = {
    machineId: input.machineId,
    materialType: MaterialType.BLOOD,
    amount: halfAmount
  };

  return outputs;
};

/**
 * Splits the first product from the input array into two products with half the amount.
 * If the input array is empty, it returns an array of two empty products.
 * 
 * @param {Product[]} inputs - An array of products, where each product has properties: machineId, materialType, and amount.
 * @returns {Product[]} An array containing two products with the same machineId and materialType as the first product from the input array, but with half the amount.
 */
function splitter(inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT];  // Initializing with two distinct empty objects

  const input = inputs[0]

  if (!input) return outputs

  const halfAmount = Number(input.amount) / 2

  outputs[0] = {
    machineId: input.machineId,
    materialType: input.materialType,
    amount: halfAmount,
  };

  outputs[1] = {
    machineId: input.machineId,
    materialType: input.materialType,
    amount: halfAmount,
  };

  return outputs
}

/**
 * Processes the input products using a mixer machine to generate a combined product.
 * 
 * @notice The function checks a list of predefined recipes to determine the output product's material type based on the material types of the input products. If a matching recipe is found, the output product is created using the machine ID of the first input product and the specified amount. If no matching recipe is found, the output material type is set to `MaterialType.NONE`.
 * @param {Product[]} inputs - An array of input products to be processed by the mixer. The array should contain exactly two products for a successful mixing process.
 * @returns {Product[]} An array containing the processed product. If the input does not meet the requirements or no matching recipe is found, it returns an array with an empty product.
 */
function mixer(inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT];  // Initializing with two distinct empty objects

  if (inputs.length !== 2) return outputs

  const recipe = Object.values(get(recipes)).find(recipe => {
    // console.log('recipe.machineType', recipe.machineType)
    // console.log('recipe.machineType === MachineType.MIXER', recipe.machineType === MachineType.MIXER)
    // console.log('getUniqueIdentifier(Number(inputs[0].materialType), Number(inputs[1].materialType))', getUniqueIdentifier(Number(inputs[0].materialType), Number(inputs[1].materialType)))
    // console.log('recipe.input', recipe.input)
    // console.log('Number(recipe.input) === Number(input.materialType)', Number(recipe.input) === getUniqueIdentifier(Number(inputs[0].materialType), Number(inputs[1].materialType)))
    // console.log('-----')
    if (
      recipe.machineType === MachineType.MIXER
      && Number(recipe.input) === getUniqueIdentifier(Number(inputs[0].materialType), Number(inputs[1].materialType))
    ) {
      return true
    }
    return false
  })

  const resultMaterialType = recipe ? recipe.output : MaterialType.NONE

  console.log("recipe", recipe)
  console.log("resultMaterialType", resultMaterialType)

  outputs[0] = {
    machineId: inputs[0].machineId,
    materialType: resultMaterialType,
    amount: inputs[0].amount
  };

  return outputs
}

/**
 * Processes the input products using a specified simple machine to generate an output product.
 * 
 * @notice The function checks a list of predefined recipes to determine the output product's material type based on the material type of the input product and the specified machine type. If a matching recipe is found, the output product is created using the machine ID of the input product and its amount. If no matching recipe is found, the output material type is set to `MaterialType.NONE`.
 * @param {MachineType} machineType - The type of simple machine used for processing.
 * @param {Product[]} inputs - An array of input products to be processed. The function primarily checks the first product in the array.
 * @returns {Product[]} An array containing the processed product. If the input does not meet the requirements or no matching recipe is found, it returns an array with an empty product.
 */
function simpleMachine(machineType: MachineType, inputs: Product[]): Product[] {
  const outputs: Product[] = [EMPTY_PRODUCT, EMPTY_PRODUCT];  // Initializing with two distinct empty objects

  const input = inputs[0]

  if (!input) return outputs

  const recipe = Object.values(get(recipes)).find(recipe => {
    // console.log('machineType', machineType)
    // console.log('recipe.machineType', recipe.machineType)
    // console.log('recipe.machineType === machineType', recipe.machineType === machineType)
    // console.log('input.materialType', input.materialType)
    // console.log('recipe.input', recipe.input)
    // console.log('Number(recipe.input) === Number(input.materialType)', Number(recipe.input) === Number(input.materialType))
    // console.log('-----')
    if (
      recipe.machineType === machineType
      && Number(recipe.input) === Number(input.materialType)
    ) {
      return true
    }
    return false
  })

  const resultMaterialType = recipe ? recipe.output : MaterialType.NONE

  console.log("recipe", recipe)
  console.log("resultMaterialType", resultMaterialType)

  outputs[0] = {
    machineId: input.machineId,
    materialType: resultMaterialType,
    amount: input.amount
  };

  return outputs
}
