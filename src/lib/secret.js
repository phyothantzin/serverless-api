import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} from "@aws-sdk/client-ssm";

const stage = process.env.STAGE || "prod";

export async function getDatabaseURL() {
  const client = new SSMClient({ region: process.env.REGION });
  const params = {
    Name: process.env.DATABASE_URL_SSM_PARAM + stage + "/database-url",
    WithDecryption: true,
  };
  const command = new GetParameterCommand(params);
  const paramStoreData = await client.send(command);

  return paramStoreData.Parameter.Value;
}

export async function putDatabaseURL(stage, dbURL) {
  if (stage === "prod") {
    return;
  }
  if (!dbURL) {
    return;
  }

  const client = new SSMClient({ region: process.env.REGION });
  const params = {
    Name: process.env.DATABASE_URL_SSM_PARAM + stage + "/database-url",
    Value: dbURL,
    Type: "SecureString",
    Overwrite: true,
  };
  const command = new PutParameterCommand(params);
  const result = await client.send(command);
  await result;
}
