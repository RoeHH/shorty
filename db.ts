import { MongoClient } from "https://deno.land/x/mongo/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

const client = new MongoClient();


await client.connect({
  db: "shorty",
  tls: true,
  servers: [
    {
      host: "ac-hlxxo0i-shard-00-02.qxxctwt.mongodb.net",
      port: 27017,
    },
  ],
  credential: {
    username: "shorty",
    password: Deno.env.get("ATLAS_PW"),
    db: "shorty",
    mechanism: "SCRAM-SHA-1",
  },
});

console.log("dfs");

const db = client.database("shorty");

interface ShortsSchema {
  _id: { $oid: string };
  short: string;
  url: string;
}
const Shorts = db.collection<ShortsSchema>("shorts");
export { db, Shorts };

