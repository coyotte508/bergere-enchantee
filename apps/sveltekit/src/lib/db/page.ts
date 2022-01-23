import type { Collection, Db } from "mongodb";
import type { Timestamps } from "./types";

export interface Page extends Timestamps {
  _id: {
    name: string;
    locale: string;
  }
  content: string;
}

export async function createPageCollection(db: Db): Promise<Collection<Page>> {
  return db.collection<Page>("pages");
}