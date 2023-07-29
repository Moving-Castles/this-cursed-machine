import { readable, writable, derived } from "svelte/store"

export const wiki = readable({
  CORE: `### Cores
Player agent. Max 4. Spawned in each corner.
Current max energy per core: 300.
`,
  RESOURCE_CONNECTION: `### Resource Connection (Red)    
Allows energy to flow into a Core from the Food source. Or energy to be transferred from a Core into an organ.
Costs 10 Energy per square.`,
  CONTROL_CONNECTION: `### Control Connection (Blue)    
Allows a Core to take actions through an organ.
Costs 20 Energy per square.
  `,
  FOOD_SOURCE:`### Food
Source of Energy, currently the only resource.
Gives one per block.
Only allows one Resource Connection.
  `,
  CLAW:`### Claw    
Organ to move things within the body.
Costs 20 Energy.
Only allows one Control Connection and one Resource Connection.
  `,
  PORTAL:`### Portal
Organ allowing a core to exit the body.
Costs 200 Energy.
Charged in 100 Energy transactions.
Only allows one Control Connection and one Resource Connection.
  `,
  COUNTER: `### Counter

A simple test organ.
Has a value that can be incremented by connecting the Control Split and having all Cores in the body vote.
Takes no direct connections.
  `,
  RESOURCE_SPLIT:`### Resource split
Hardcoded to connect to the Food source.<br>
Splits the energy stream equally between all connected cores.
Takes unlimited Resource connections.
  `,
  CONTROL_SPLIT:`### Control Split
Hardcoded to connect to the Counter.
Triggers counter when all cores in body have voted.
`,
  MODIFIER:`### Modifier
Takes a resource connection.
Doubles incoming resources
`,
})

export const explainer = writable("")

export const explanation = derived([explainer, wiki], ([$explainer, $wiki]) => {
  if ($explainer !== "") {
    return $wiki[$explainer]
  }

  return ""
})