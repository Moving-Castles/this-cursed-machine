import { MATERIAL_TYPE } from "../../base/enums"

export type Product = {
    machineId: string
    materialType: MATERIAL_TYPE
    amount: number
    divisor: number
}