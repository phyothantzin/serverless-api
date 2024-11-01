import { neon } from "@neondatabase/serverless";
import { getDatabaseURL } from "../lib/secret.js";
import { drizzle } from "drizzle-orm/neon-http";

export async function getDbClient() {
  const dbURL = await getDatabaseURL();
  return neon(dbURL);
}

export async function getDrizzleDBClient() {
  const sql = await getDbClient();
  return drizzle(sql);
}
