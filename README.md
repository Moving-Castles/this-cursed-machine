# CIRCUIT POC

<img width="750" alt="Screenshot 2023-06-30 at 23 15 23" src="https://github.com/Moving-Castles/circuit-poc/assets/8209990/e4679f97-5620-4b72-b31d-49b05030ef28">

## Currently implemented

### Cores

Player agent. Max 4. Spawned in each corner. Current max energy per core: 300.

### Resource Connection (Red)

Allows energy to flow into a Core from the `Food` source. Or energy to be transferred from a Core into an organ.
Costs 10 Energy per square.

### Control Connection (Blue)

Allows a Core to take actions through an organ.
Costs 20 Energy per square.

### Food

Source of `Energy`, currently the only resource.
Gives one per block.
Only allows one `Resource Connection`.

### Claw

Organ to move things within the body.
Costs 20 Energy.
Only allows one `Control Connection` and one `Resource Connection`.

### Portal

Organ allowing a core to exit the body.
Costs 200 Energy.
Charged in 100 Energy transactions.
Only allows one `Control Connection` and one `Resource Connection`.

### Counter

A simple test organ.
Has a value that can be incremented by connecting the `Control Split` and having all Cores in the body vote.
Takes no direct connections.

### Resource split

Hardcoded to connect to the `Food` source.
Splits the energy stream equally between all connected cores.
Takes unlimited Resource connections.

### Control Split

Hardcoded to connect to the `Counter`.
Triggers counter when all cores in body have voted.
