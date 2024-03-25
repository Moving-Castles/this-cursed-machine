import { MATERIAL_TYPE } from "../../base/enums"

export type Product = {
    machineId: string
    sourceMachineId?: string | null
    materialType: MATERIAL_TYPE
    amount: number
    inletActive: boolean[]
}