import type { LoadOutput } from "@sveltejs/kit/types/internal";

import type { LoadInput } from "@sveltejs/kit/types/internal";

throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export async function load(input: LoadInput): Promise<LoadOutput> {
const res = await input.fetch("/produits/" + input.params.id);

if (!res.ok) {
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
  return {status: res.status};
}

const {product} = await res.json();

throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
return {
  props: {
    product,
  },
  stuff: {
    ...input.stuff,
    title: `${product.name} - ${product.price} €`,
    description: product.description,
    pictures: product.photos,
    type: "og:product",
    price: product.price,
  }
};
}

