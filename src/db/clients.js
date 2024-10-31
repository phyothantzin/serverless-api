import { neon } from "@neondatabase/serverless";
import { getDatabaseURL } from "../lib/secret.js";

export async function getDbClient() {
  const dbURL = await getDatabaseURL();
  return neon(dbURL);
}
