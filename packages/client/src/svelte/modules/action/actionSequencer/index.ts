/*
 *  The action sequencer is responsible for sending transactions 
 *  to the blockchain, one at a time.
 *
 */

import type { IWorld } from "contracts/types/ethers-contracts/IWorld";
import { writable, get } from "svelte/store";
import { network, blockNumber } from "../../network";
import { toastMessage } from "../../ui/toast"
import { v4 as uuid } from "uuid"
import { setActionTimeout, clearActionTimeout } from "./timeoutHandler";

// --- TYPES -----------------------------------------------------------------

export enum SequencerState {
  Running,
  Paused,
}

export type Action = {
  actionId: string;
  systemId: keyof IWorld
  tx?: string;
  timestamp?: number;
  params?: string[];
};

// --- STORES -----------------------------------------------------------------

export const sequencerState = writable(SequencerState.Running);
export const queuedActions = writable([] as Action[]);
export const activeActions = writable([] as Action[]);
export const completedActions = writable([] as Action[]);
export const failedActions = writable([] as Action[]);

// --- API -----------------------------------------------------------------

/**
 * 
 * @param systemId 
 * @param params 
 * @returns action
 */
export function addToSequencer(systemId: keyof IWorld, params: any[] = []) {
  const newAction = {
    actionId: uuid(),
    systemId: systemId,
    params: params
  };

  queuedActions.update((queuedActions) => {
    return [...queuedActions, newAction];
  });

  // Display error message if action does not complete in 10 seconds
  setActionTimeout(10000);

  return newAction
}

export function removeFromSequencer(id: string) {
  queuedActions.update((queuedActions) => queuedActions.filter((a) => a.actionId !== id));
}

export function clearSequencer() {
  queuedActions.update(() => []);
}

// --- SEQUENCER -----------------------------------------------------------------

export function initActionSequencer() {



  /*
   *   The sequencer triggers on each block
   *   If the conditions are met it executes the next action
   *   To be notified of the action being executed we listen to calls to all systems
   *
   */

  blockNumber.subscribe(async () => {
    /*
      * Execute next if:
      * - sequencer is running
      * - there are no active action
      * - queue is not empty
      */
    if (
      get(sequencerState) === SequencerState.Running &&
      get(activeActions).length === 0 &&
      get(queuedActions).length > 0
    ) {
      execute();
    }
  });

  // Listen to ECS system calls to determine when an action has been executed
  get(network).ecsEvent$.subscribe(event => {
    if (event.type === "NetworkComponentUpdate") {
      const action = get(activeActions).find((a) => a.tx === event.txHash);
      if (!action) return;
      // Remove action from active list
      activeActions.update((activeActions) => activeActions.filter((a) => a.tx !== action?.tx));
      // Add action to completed list
      completedActions.update((completedActions) => [action, ...completedActions]);
      // Clear action timeout
      clearActionTimeout();
    }
  })
}

async function execute() {
  const action = get(queuedActions)[0];
  try {
    // Remove action from queue list
    queuedActions.update((queuedActions) => queuedActions.slice(1));
    // TODO: Check if player can do action
    // Add action to active list
    activeActions.update((activeActions) => [action, ...activeActions]);
    // @todo: fix types
    const tx = await get(network).worldSend(action.systemId, [...action.params]);
    // Transaction sent. Add tx hash and timestamp to action.
    activeActions.update((activeActions) => {
      activeActions[0].tx = tx.hash;
      activeActions[0].timestamp = Date.now();
      return activeActions;
    });
  } catch (e) {
    // @todo: handle error better
    console.error(e)
    toastMessage("Something went wrong", { type: "error" })
    // Clear active list
    activeActions.update(() => []);
    // Add action to failed list
    failedActions.update((failedActions) => [action, ...failedActions]);
    // Clear action timeout
    clearActionTimeout();
  }
}
