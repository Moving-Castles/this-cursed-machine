export type Product = {
    machineId: string
    sourceMachineId?: string | null
    materialId: MaterialId
    amount: bigint
    inletActive: boolean[]
}