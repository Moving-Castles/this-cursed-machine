import { get } from "svelte/store"
import { entities } from "../state/base/stores"
import { publicNetwork } from "../network"
import { toCamelCase } from "../utils"
import { ComponentUpdate } from "@latticexyz/recs"

// Update queue
class UpdateQueue {
    private queue: (() => Promise<void>)[];
    private processing: boolean;

    constructor() {
        this.queue = [];
        this.processing = false;
    }

    public enqueue(task: () => Promise<void>): void {
        this.queue.push(task);
        this.processNext();
    }

    private async processNext(): Promise<void> {
        console.log('processNext')
        if (this.processing || this.queue.length === 0) {
            return;
        }
        this.processing = true;
        const task = this.queue.shift();
        if (task) {
            try {
                await task();
            } catch (error) {
                console.error('Error processing task:', error);
            }
        }
        this.processing = false;
        this.processNext();
    }
}

// Create a global instance of the queue
const updateQueue = new UpdateQueue();

export function createComponentSystem(componentKey: string) {
    (get(publicNetwork).components as any)[componentKey].update$.subscribe((update: ComponentUpdate) => {
        const task = async () => {
            const [nextValue] = update.value;
            const newValue = nextValue && Object.prototype.hasOwnProperty.call(nextValue, "value") ? nextValue.value : nextValue;
            const entityID = update.entity;
            const propertyName = componentKey === "ContainedMaterial" ? "materialId" : toCamelCase(componentKey);

            entities.update((value: { [key: string]: any }) => {
                if (value[entityID] === undefined) value[entityID] = {};
                if (newValue === undefined) {
                    delete value[entityID][propertyName];
                } else {
                    value[entityID][propertyName] = newValue;
                }
                return value;
            });
        };

        updateQueue.enqueue(task);
    })
}
