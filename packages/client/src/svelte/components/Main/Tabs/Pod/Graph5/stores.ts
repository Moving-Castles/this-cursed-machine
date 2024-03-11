// import { derived } from 'svelte/store'
// import { playerPod } from "@modules/state/base/stores"
// import {
//     simulatedMachines,
//     simulatedConnections,
// } from "@modules/state/simulated/stores"
// import { createLayout } from "./layout"


// // Simulated state = on-chain state of the machines + patches produced by the local resolver
// export const graph = derived(
//     [playerPod, simulatedMachines, simulatedConnections],
//     ([$playerPod, $simulatedMachines, $simulatedConnections]) => createLayout($playerPod.fixedEntities,
//         $simulatedMachines,
//         $simulatedConnections,
//         graphMachines,)
// )