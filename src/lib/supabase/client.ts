import { getSupabaseBrowserClient } from "./auth";

export function createClient() {
  return getSupabaseBrowserClient();
}
