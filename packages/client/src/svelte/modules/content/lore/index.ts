import { MachineType } from "../../state/enums"

const machineInformation = {
  NONE: "Does not exist",
  INLET: "Passes things into your box",
  OUTLET: "Blocks things",
  CORE: "Cores are you and other inhabitants of this box",
  BLENDER: "Blends two or more materials together",
  SPLITTER: "Splits a material into more outputs",
  SCORCHER: "Heats things up",
  COMBI_GATE: "Combines materials with governance applied",
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
