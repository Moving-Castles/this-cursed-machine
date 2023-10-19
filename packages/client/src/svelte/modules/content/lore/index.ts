import { MachineType } from "../../state/enums"

const machineInformation = {
  NONE: "Does not exist",
  INLET: "Puts resources into grid",
  OUTLET: "Lets resources output from grid",
  CORE: "TCM fulfilment centre operators, surgically made to a short blunt shape to optimise capital flow through their biomass. ",
  SPLITTER: "Splits a material into more outputs",
  MIXER: "Blends two or more materials together",
  DRYER: "Dries materials",
  WETTER: "Wets materials",
  BOILER: "Heats materials",
  COOLER: "Cools materials",
  // COMBI_GATE: "Combines materials with governance applied",
}

function addNumericKeysFromEnum(e, o) {
  const keys = Object.keys(o)
  let result = { ...o }

  keys.forEach(key => {
    // get the corresponding mapped numId
    let numId = e[key]
    result[numId] = o[key]
  })

  return result
}

export const MACHINE_LORE = addNumericKeysFromEnum(
  MachineType,
  machineInformation
)
