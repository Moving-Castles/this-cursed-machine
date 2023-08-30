/*
 *  The action sequencer is responsible for sending transactions 
 *  to the blockchain, one at a time.
 *
 */

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
  systemId: string;
  params: string[];
  tx?: string;
  timestamp?: number;
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
export function addToSequencer(systemId: string, params: any[] = []) {

  const newAction: Action = {
    actionId: uuid(),
    systemId: systemId,
    params: params || [],
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
}

async function execute() {
  const action = get(queuedActions)[0];
  try {
    // Remove action from queue list
    queuedActions.update((queuedActions) => queuedActions.slice(1));
    // Add action to active list
    activeActions.update((activeActions) => [action, ...activeActions]);
    // Make the call
    const tx = await get(network).worldContract.write[action.systemId]([...action.params]);
    // Transaction sent. Add tx hash and timestamp to action.
    activeActions.update((activeActions) => {
      activeActions[0].tx = tx;
      activeActions[0].timestamp = Date.now();
      return activeActions;
    });
    // Wait for transaction to be executed
    let result = await get(network).waitForTransaction(tx);
    if (result.receipt.status == "success") {
      // Add action to completed list
      completedActions.update((completedActions) => [action, ...completedActions]);
      // Clear active list
      activeActions.update(() => []);
      // Clear action timeout
      clearActionTimeout();
    } else {
      handleError(result.receipt, action);
    }
  } catch (e) {
    handleError(e, action);
  }
}

function handleError(error: any, action: Action) {
  // @todo: handle error better
  console.error(error)
  toastMessage("Something went wrong", { type: "error" })
  // Add action to failed list
  failedActions.update((failedActions) => [action, ...failedActions]);
  // Clear active list
  activeActions.update(() => []);
  // Clear action timeout
  clearActionTimeout();
}

