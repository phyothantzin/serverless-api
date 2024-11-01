import serverless from "serverless-http";
import express from "express";
import { getDbClient, getDrizzleDBClient } from "./db/clients.js";
import User from "./db/schemas.js";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

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

app.get("/api/user", async (req, res, next) => {
  const db = await getDrizzleDBClient();
  const users = await db.select().from(User).limit(10);
  return res.status(200).json(users);
});

app.get("/api/user/:id", async (req, res, next) => {
  const db = await getDrizzleDBClient();
  const { id } = req.params;
  const user = await db.select().from(User).where(eq(User.id, id)).limit(1);
  return res.status(200).json(user);
});

app.post("/api/user", async (req, res, next) => {
  const { email } = await req.body;

  if (!email) {
    return res.status(400).json({
      error: "Missing email",
    });
  }

  const db = await getDrizzleDBClient();

  const user = await db.insert(User).values({ email }).returning();
  return res.status(201).json(user);
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
