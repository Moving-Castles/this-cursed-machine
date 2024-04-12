/*
 * This file sets up all the definitions required for a MUD client.
 */

import { setupNetwork } from "./setupNetwork";
import { ENVIRONMENT } from "./enums";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup(environment: ENVIRONMENT) {
  const network = await setupNetwork(environment);
  return network;
}
