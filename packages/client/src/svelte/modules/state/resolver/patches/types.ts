export type Product = {
    machineId: string
    sourceMachineId?: string | null
    materialId: MaterialId
    amount: number
    inletActive: boolean[]
}