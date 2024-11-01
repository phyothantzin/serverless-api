import dotenv from "dotenv";
import { putDatabaseURL } from "../lib/secret";

dotenv.config();

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.error("Usage: node putDatabaseSecret.js <stage> <dbURL>");
  process.exit(1);
}

const stage = args[0];
const dbURL = args[1];

if (import.meta.url === new URL(import.meta.url).href) {
  putDatabaseURL(stage, dbURL)
    .then(() => {
      console.log(`Secret updated`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
