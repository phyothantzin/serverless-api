import serverless from "serverless-http";
import express from "express";
import { neon } from "@neondatabase/serverless";
import AWS from "aws-sdk";

const app = express();

const ssm = new AWS.SSM({ region: process.env.REGION });

async function dbClient() {
  const paramStoreData = await ssm
    .getParameter({
      Name: process.env.DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    })
    .promise();

  const sql = neon(paramStoreData.Parameter.Value);
  return sql;
}

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const [results] = await sql`SELECT now();`;
  const delta = (Date.now() - results.now.getTime()) / 1000;
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
