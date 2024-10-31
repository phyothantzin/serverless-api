import serverless from "serverless-http";
import express from "express";
import { getDbClient } from "./db/clients.js";

const app = express();

app.get("/", async (req, res, next) => {
  const sql = await getDbClient();
  const now = Date.now();
  const [results] = await sql`SELECT now();`;
  const delta = (results.now.getTime() - now) / 1000;
  return res.status(200).json({
    message: "Hello from root!",
    delta: delta,
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
