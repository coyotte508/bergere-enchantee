import type { Collection, Db, ObjectId } from "mongodb";
import type { Timestamps } from "./types";

export interface Picture extends Timestamps {
  product?: ObjectId;
  
  storage: Array<{
    width: number,
    height: number,
    _id: ObjectId
  }>
}

export async function createPictureCollection(db: Db): Promise<Collection<Picture>> {
  const coll = db.collection<Picture>("pictures");

  return coll;
}
