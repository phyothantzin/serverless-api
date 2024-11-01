import dotenv from "dotenv";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { getDatabaseURL } from "../lib/secret.js";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import schema from "../db/schemas";
import ws from "ws";

dotenv.config();

async function performMigration() {
  const dbUrl = await getDatabaseURL();
  if (!dbUrl) {
    return;
  }

  // neon serverless pool
  // https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client
  neonConfig.webSocketConstructor = ws; // <-- this is the key bit
  const pool = new Pool({ connectionString: dbUrl });
  pool.on("error", (err) => console.error(err)); // deal with e.g. re-connect
  // ...
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: "src/migrations" });
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  await pool.end();
}

if (import.meta.url === new URL(import.meta.url).href) {
  performMigration()
    .then(() => {
      console.log("Migration complete");
      process.exit(0);
    })
    .catch((err) => {
      console.log("Migration failed");
      console.error(err);
      process.exit(1);
    });
}
