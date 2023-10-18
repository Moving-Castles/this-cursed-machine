// - - - - - - - - - RASMUS START

// let inputWrapper: HTMLDivElement

// const adjustCursor = () => {
//   const widthOfText = inputElement.value.length
//   inputWrapper.style.setProperty("--cursor-pos", `${widthOfText}ch`)
// }

// .input-wrapper {
//   position: relative;

//   &::after {
//     content: "";
//     position: absolute;
//     bottom: 2px; /* Adjust as needed */
//     left: var(--cursor-pos, 0);
//     height: 1em; /* Or the height of a monospace character */
//     width: 1ch; /* 1ch is the width of the '0' character in the font being used */
//     background-color: white; /* Adjust color as needed */
//     animation: blink 1s infinite;
//     z-index: 2000000; /* or some other positive value */
//   }


// @keyframes blink {
//     0%,
//     49% {
//       opacity: 1;
//     }
//     50%,
//     100% {
//       opacity: 0;
//     }
//   }

// - - - - - - - - - RASMUS END

// $: {
//   if ($watchingAction === null) {
//     clearPotential()
//     scrollToEnd()
//   }
// }

// const clearPotential = async () => {
//   selectedAction = ""
//   userInput = ""
//   potential.set({})
//   await tick()
//   inputElement?.focus()
// }

// const displayMachinePotential = ({ detail }) => {
//   potential.set({
//     [uuid()]: {
//       machineType: MachineType[detail],
//       entityType: EntityType.MACHINE,
//       potential: true,
//       carriedBy: $playerCore.carriedBy,
//     },
//   })
// }

// const displayConnectionPotential = ({ detail }) => {
//   const [_, availableFrom] = availablePorts(detail[0])
//   const [__, availableTo] = availablePorts(detail[0])

//   if (availableFrom.length > 0 && availableTo.length > 0) {
//     potential.set({
//       [uuid()]: {
//         entityType: EntityType.CONNECTION,
//         sourcePort: availableFrom[0][0],
//         targetPort: availableTo[0][0],
//         potential: true,
//       },
//     })
//   }
// }

// const filterByAvailablePorts = ([machineId, _]) => {
//   // Get machine associated ports
//   const machinePorts = Object.entries($simulatedPorts).filter(
//     ([_, port]) => port.carriedBy === machineId
//   )

//   const occupiedPorts = machinePorts.filter(([id, _]) => {
//     return Object.values($simulatedConnections).find(
//       connection =>
//         connection.sourcePort === id || connection.targetPort === id
//     )
//   })

//   return machinePorts.length - occupiedPorts.length > 0
// }

