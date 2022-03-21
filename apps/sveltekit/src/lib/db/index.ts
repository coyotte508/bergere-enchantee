import dotenv from "dotenv";

dotenv.config();

import {MongoClient} from "mongodb";
import { createPageCollection } from "./page";
import { createPictureCollections } from "./picture";
import { createUserCollection } from "./user";

const client = new MongoClient(process.env.MONGODB_URL ?? "mongodb://localhost:27017");

await client.connect();

const db = client.db("bergere");

const pages = await createPageCollection(db);
const users = await createUserCollection(db);
const {pictures, picturesFs} = await createPictureCollections(db);

export {
  client,
  db,
  pages,
  users,
  pictures,
  picturesFs
};
