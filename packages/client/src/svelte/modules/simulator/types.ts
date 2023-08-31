
import { MaterialType } from "../state/enums";

export type Product = {
    machineId: string;
    materialType: MaterialType;
    amount: number;
    temperature: number;
}

type IntermediaryState = {
    intermediaryProducts?: Product[];
}

export type SimulatedEntity = Entity & IntermediaryState;

export type SimulatedEntities = {
    [key: string]: SimulatedEntity;
}