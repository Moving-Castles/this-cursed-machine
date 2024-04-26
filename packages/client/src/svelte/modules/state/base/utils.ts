import { ENTITY_TYPE, MACHINE_TYPE } from "./enums"
import { Entity } from "@latticexyz/recs"
import { decodeEntity } from "@latticexyz/store-sync/recs"
import { MaterialIdNone } from "./constants"

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
        input: input,
        outputs: recipe[1].recipe?.outputs ?? [MaterialIdNone, MaterialIdNone],
      } as Recipe
    })

  return recipes
}

export function getAvailableOrders(
  orders: Orders,
  blockNumber: bigint,
  playerInTutorial: boolean,
  tutorialLevel: number
): Orders {
  let filteredOrders: [string, Order][];

  // Filter orders based on tutorial status and expiration
  if (!playerInTutorial) {
    filteredOrders = Object.entries(orders).filter(([, order]) =>
      order.order ? (!order.tutorial && (order.order.expirationBlock === 0n || order.order.expirationBlock > blockNumber)) : false
    );
  } else {
    filteredOrders = Object.entries(orders).filter(([, order]) =>
      order.order ? order.tutorialLevel === tutorialLevel : false
    );
  }

  // Sort the filtered orders by creationBlock in descending order using a bigint-safe comparator
  const sortedOrders = filteredOrders.sort((a, b) => {
    if (b[1].order && a[1].order) {
      return (b[1].order.creationBlock > a[1].order.creationBlock) ? 1 :
        (b[1].order.creationBlock < a[1].order.creationBlock) ? -1 : 0;
    }
    return 0;
  });

  // Convert array back to object and return
  return Object.fromEntries(sortedOrders);
}

export function getExpiredOrders(orders: Orders, blockNumber: number): Orders {
  return Object.fromEntries(
    Object.entries(orders).filter(([, order]) =>
      order.order ? order.order.expirationBlock <= blockNumber : false
    )
  )
}

export function getMaterialMetadata(entities: Entities): Record<MaterialId, MaterialMetadata> {
  const materialMetadata: Record<MaterialId, MaterialMetadata> = {}
  Object.entries(entities)
    .filter(([_, entity]) => entity.hasOwnProperty("materialMetadata"))
    .forEach(value => {
      const { materialId } = decodeEntity(
        { materialId: "bytes14" },
        value[0] as Entity
      )
      materialMetadata[materialId] = {
        materialId,
        ...value[1].materialMetadata
      } as MaterialMetadata
    })

  return materialMetadata
}
