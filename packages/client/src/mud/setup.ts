/*
 * This file sets up all the definitions required for a MUD client.
 */

import { setupNetwork } from "./setupNetwork";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
  const network = await setupNetwork();
  return network;
}
