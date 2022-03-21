import type { Collection, Db } from "mongodb";
import type { Timestamps } from "./types";

export interface Picture extends Timestamps {
  _id: string;
  product?: string;
  name: string;
  
  storage: Array<{
    _id: string,
    width: number,
    height: number,
    size: number;
  }>
}

export interface PictureFs extends Timestamps {
  _id: string;
  data: Buffer;
  size: number;
}

export async function createPictureCollections(db: Db): Promise<{pictures: Collection<Picture>, picturesFs: Collection<PictureFs>}> {
  const coll = db.collection<Picture>("pictures");
  const fs = db.collection<PictureFs>("pictures.fs");

  return {pictures: coll, picturesFs: fs};
}
