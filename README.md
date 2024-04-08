# THIS CURSED MACHINE

THIS CURSED MACHINE is a sci-fi body horror fulfilment center simulator. Reverse engineer complex recipes and use your own body as a large scale production circuit. Build strange machines and connect them in intricate supply chains to fullfil orders more quickly than the other workers.

## Run locally

1. [Install foundry](https://getfoundry.sh/)
2. Install dependencies: `pnpm i`
3. Got to `packages/contracts`and set `PRIVATE_KEY` to the anvil default private key: `echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > .env`
3. Start the development environment with `pnpm dev` in the project root. This will start a local chain, deploy the contracts in `packages/contracts`, and start a development server for the client.
4. Go to `http://localhost:5173/` in browser.