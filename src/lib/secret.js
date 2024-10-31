import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export async function getDatabaseURL() {
  const client = new SSMClient({ region: process.env.REGION });
  const params = {
    Name: process.env.DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(params);
  const paramStoreData = await client.send(command);

  return paramStoreData.Parameter.Value;
}
