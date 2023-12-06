import { Action } from "."

export enum TransactionState {
    READY,
    INITIATED,
    WAITING,
    SENDING,
    DONE,
}

/**
 * Waits for the specified action's transaction to be set.
 *
 * @function waitForTransaction
 * @param {Action} action - The action object to check for a transaction.
 * @param {function} [loadingFunction] - An optional function to call while waiting for completion.
 * @returns {Promise<Action>} - A promise that resolves with the action once its transaction is set, or rejects after a certain number of retries.
 */
export const waitForTransaction = (
    action: Action,
    loadingFunction?: (index: number) => void
): Promise<Action> => {
    return new Promise((resolve, reject) => {
        const maxRetries = 150
        let attempts = 0
        let index = 0

        const checkTransaction = () => {
            index++
            if (loadingFunction) loadingFunction(index)
            if (action.tx) {
                // check if tx is set (i.e., it has a truthy value)
                resolve(action)
            } else if (action.error) {
                reject(new Error(action.error))
            } else if (attempts < maxRetries) {
                attempts++
                // wait for some time before checking again
                setTimeout(checkTransaction, 100)
            } else {
                reject(new Error("Max retries reached without transaction."))
            }
        }

        checkTransaction()
    })
}

/**
 * Waits for the specified action to be completed.
 *
 * @function waitForCompletion
 * @param {Action} action - The action object to check for completion.
 * @param {function} [loadingFunction] - An optional function to call while waiting for completion.
 * @returns {Promise<Action>} - A promise that resolves with the action once it's completed, or rejects after a certain number of retries.
 */
export const waitForCompletion = (
    action: Action,
    loadingFunction?: (index: number) => void
): Promise<Action> => {
    return new Promise((resolve, reject) => {
        const maxRetries = 150
        let attempts = 0
        let index = 0

        const checkCompletion = () => {
            index++
            if (loadingFunction) loadingFunction(index)
            if (action.completed) {
                resolve(action)
            } else if (action.error) {
                reject(new Error(action.error))
            } else if (attempts < maxRetries) {
                attempts++
                // wait for some time before checking again
                setTimeout(checkCompletion, 100)
            } else {
                reject(new Error("Max retries reached without completion."))
            }
        }

        checkCompletion()
    })
}