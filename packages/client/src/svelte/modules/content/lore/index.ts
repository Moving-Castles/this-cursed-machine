import { MachineType, MaterialType } from "../../state/enums"

const machineInformation = {
  NONE: "Does not exist",
  INLET: "Puts resources into grid",
  OUTLET: "Lets resources output from grid",
  CORE: "TCM fulfillment centre operators, surgically made to a short blunt shape to optimise capital flow through their biomass. ",
  SPLITTER: "Splits a material into more outputs",
  MIXER: "Blends two or more materials together",
  DRYER: "Dries materials",
  WETTER: "Wets materials",
  BOILER: "Heats materials",
  COOLER: "Cools materials",
}

const materialInformation = {
  NONE: "Does not exist",
  BUG: "Tiny nuisances, much like our existence.",
  PISS: "PISS, you know what it iss... a golden reflection.",
  BLOOD_LIPIDS: "Lipido Maximo.",
  BLOOD: "Bluten Orangen got nothing on us. Easy to spill.",
  SLUDGE: "Thick, dirty smudging dredge.",
  DIRT: "Salt of the earth. Crushed, like ground up dreams.",
  ENERGY: "You have it, it makes you more productive.",
  PLANT: "Haven't seen those in a while",
  CAFFEINE_SLUSHY: "... .,.. . .. Google won't tell me",
  CLUB_MATE:
    "My neighbour, I think he exists. I think he is trying to tell me about this drink from rural Germany",
  DIET_RED_BULL: "Post and pre-workout and game drink... I need some",
  PRIME: "The zenith of despair in a can, tastes just like existential dread.",
  M150: "150 ways to feel... nothing. Great.",
  FIVE_HOUR_ENERGY:
    "Five hours? More like five minutes of delusional hope before reality sets in.",
  MONSTER:
    "Monstrously overrated. But hey, at least it matches the void inside.",
  E_LIQUID:
    "Electronic despair in liquid form, because breathing wasn't sad enough.",
  TOBACCO: "Old-school self-sabotage. Classic.",
  CIGARETTE_JUICE:
    "Oh, the modern version of self-loathing. How... innovative.",
  ERASERBABY:
    "..."
}

const materialImages = {
  NONE: "",
  BUG: "/images/materials/BUG.gif",
  PISS: "",
  BLOOD_LIPIDS: "",
  BLOOD: "",
  SLUDGE: "",
  DIRT: "",
  ENERGY: "",
  PLANT: "",
  CAFFEINE_SLUSHY: "",
  CLUB_MATE: "",
  DIET_RED_BULL: "",
  PRIME: "",
  M150: "",
  FIVE_HOUR_ENERGY: "",
  MONSTER: "",
  E_LIQUID: "",
  TOBACCO: "",
  CIGARETTE_JUICE: "",
  ERASERBABY: "",
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

export const MATERIAL_LORE = addNumericKeysFromEnum(
  MaterialType,
  materialInformation
)

export const MATERIAL_IMAGES = addNumericKeysFromEnum(
  MaterialType,
  materialImages
)
