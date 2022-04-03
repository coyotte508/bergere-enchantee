import type { Picture } from "$lib/db/picture";
import type { Collection, Db } from "mongodb";
import type { Timestamps } from "./types";

export interface Product extends Timestamps {
  _id: string;
  name: string;
  description: string;
  price: number;
  kind: "armchair" | "cushion";
  state: "draft" | "published" | "retired";

  photos: Picture[];
}

export function createProductCollection(db: Db): Collection<Product> {
  const coll = db.collection<Product>("products");

  return coll;
}
