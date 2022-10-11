throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export const load: PageLoad = async (input) => {
  const res = await input.fetch("/produits", {headers: {"content-type": "application/json"}});
  if (!res.ok) {
    throw await res.json();
  }
  const {
    published, retired
  } = await res.json();

  return {
  published,
  retired
};
};
