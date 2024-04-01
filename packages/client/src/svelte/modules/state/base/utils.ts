import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"
import { Entity } from "@latticexyz/recs"
import { decodeEntity } from "@latticexyz/store-sync/recs"

export function filterByEntitytype(
  entities: Entities,
  entityType: ENTITY_TYPE
): Entities {
  return Object.fromEntries(
    Object.entries(entities).filter(
      ([, entity]) => entity.entityType === entityType
    )
  )
}

export function filterByMachinetype(
  entities: Entities,
  machineType: MACHINE_TYPE
): Entities {
  return Object.fromEntries(
    Object.entries(entities).filter(
      ([, entity]) => entity.machineType === machineType
    )
  )
}

export function filterByCarriedBy(entities: Entities, id: string): Entities {
  return Object.fromEntries(
    Object.entries(entities).filter(([, entity]) => entity.carriedBy === id)
  )
}

export function getRecipes(entities: Entities): Recipe[] {
  // First filters to entites that has recipe property
  // Then decodes the composite key to get the machineType and input
  const recipes: Recipe[] = Object.entries(entities)
    .filter(([_, entity]) => entity.hasOwnProperty("recipe"))
    .map(recipe => {
      const { machineType, input } = decodeEntity(
        { machineType: "bytes32", input: "bytes32" },
        recipe[0] as Entity
      )
      return {
        machineType: parseInt(machineType, 16),
        input: parseInt(input, 16),
        outputs: recipe[1].recipe?.outputs ?? [0, 0],
      } as Recipe
    })

  return recipes
}

export function getAvailableOrders(
  orders: Orders,
  blockNumber: number,
  playerInTutorial: boolean,
  tutorialLevel: number
): Orders {
  // If not in tutorial, return all orders that are not expired
  if (!playerInTutorial) {
    return Object.fromEntries(
      Object.entries(orders).filter(([, order]) =>
        order.order ? order.order.expirationBlock > blockNumber : false
      )
    )
  }

  // If in tutorial, return only the orders that are in the tutorial level
  return Object.fromEntries(
    Object.entries(orders).filter(([, order]) =>
      order.order ? order.tutorialLevel == tutorialLevel : false
    )
  )
}

export function getExpiredOrders(orders: Orders, blockNumber: number): Orders {
  return Object.fromEntries(
    Object.entries(orders).filter(([, order]) =>
      order.order ? order.order.expirationBlock <= blockNumber : false
    )
  )
}
