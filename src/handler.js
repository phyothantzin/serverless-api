import serverless from "serverless-http";
import express from "express";
import { neon, neonConfig } from "@neondatabase/serverless";

const app = express();

async function dbClient() {
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const [results] = await sql`SELECT now();`;
  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

export const handler = serverless(app);
