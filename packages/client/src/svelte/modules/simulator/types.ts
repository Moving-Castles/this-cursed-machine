
import { MaterialType } from "../state/enums";

export type Product = {
    machineId: string;
    materialType: MaterialType;
    amount: number;
}

type IntermediaryState = {
    inputs?: Product[];
    outputs?: Product[];
}

export type SimulatedEntity = Entity & IntermediaryState;

export type SimulatedEntities = {
    [key: string]: SimulatedEntity;
}