import type { Collection, Db } from "mongodb";
import type { Timestamps } from "./types";

export interface User extends Timestamps {
  email: string;
  hash: string;
  token?: string;
  authority?: "admin";
}

export async function createUserCollection(db: Db): Promise<Collection<User>> {
  const coll = db.collection<User>("users");

  await coll.createIndex({
    email: 1
  }, {
    collation: {
      locale: "en",
      strength: 1
    }
  });

  return coll;
}