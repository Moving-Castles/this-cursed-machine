import { setupNetwork } from "./setupNetwork";

// export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  try {
    const network = await setupNetwork();
    console.log(network)
    return network;
  } catch (err) {
    console.error(err)
    return err
  }
}
