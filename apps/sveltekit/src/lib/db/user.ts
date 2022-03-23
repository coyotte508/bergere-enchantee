import type { Collection, Db, MongoClient } from "mongodb";
import type { Timestamps } from "./types";

export interface User extends Timestamps {
  email: string;
  hash: string;
  token?: string;
  authority?: "admin";
}

export function createUserCollection(db: Db, client: MongoClient): Collection<User> {
  const coll = db.collection<User>("users");

  client.on("open", () => {
    coll.createIndex({
      email: 1
    }, {
      collation: {
        locale: "en",
        strength: 1
      }
    }).catch(console.error);
  });

  return coll;
}