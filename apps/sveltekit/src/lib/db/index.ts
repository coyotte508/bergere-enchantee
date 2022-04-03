import dotenv from "dotenv";

dotenv.config();

import {MongoClient} from "mongodb";
import { createPageCollection } from "./page";
import { createPictureCollections } from "./picture";
import { createProductCollection } from "./product";
import { createUserCollection } from "./user";

const client = new MongoClient(process.env.MONGODB_URL ?? "mongodb://localhost:27017", {directConnection: true});

export const connectPromise = client.connect().catch(console.error);

const db = client.db("bergere");

const pages = createPageCollection(db, client);
const users = createUserCollection(db, client);
const products = createProductCollection(db);
const {pictures, picturesFs} = createPictureCollections(db, client);

export {
  client,
  db,
  pages,
  users,
  pictures,
  picturesFs,
  products
};
