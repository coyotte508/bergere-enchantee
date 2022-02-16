import type { Collection, Db } from "mongodb";
import type { Timestamps } from "./types";

export interface Product extends Timestamps {
  description: string;
  price: number;
  kind: "armchair" | "cushion";
}

export async function createProductCollection(db: Db): Promise<Collection<Product>> {
  const coll = db.collection<Product>("products");

  return coll;
}
