import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/atlas_sdk@v1.0.2/mod.ts";
import { naturalToRoman } from "https://deno.land/x/roman_number_utils@1.0.1/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
const { DATA_API_KEY, APP_ID } = config();

const client = new MongoClient({
  endpoint: "https://data.mongodb-api.com/app/" + APP_ID + "/endpoint/data/v1",
  dataSource: "iccee0",
  auth: {
    apiKey: DATA_API_KEY,
  },
});

interface ShortsSchema {
  url: string;
  short: string;
}

const db = client.database("shorty");
const shorts = db.collection<ShortsSchema>("shorts");

export async function newShort(url: string): Promise<{url:string, short:string}> {
  const existingUrl = await shorts.findOne({ url })
  if (existingUrl) {
    return { url, short: existingUrl.short };
  }
  const short = naturalToRoman(await shorts.countDocuments() + 1);
  await shorts.insertOne({
    url,
    short,
  });
  return { url, short };
}

export async function getUrl(short: string): Promise<{url:string, short:string}> {
  const url = await shorts.findOne({ short: short.toUpperCase() });
  return url ? { url: url.url, short } : { url: "", short };
}
