<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";
  import type { StringDict } from "src/global";
  import type { Stuff } from "./__layout.svelte";

  export function load(input: LoadInput<StringDict, Stuff>): LoadOutput {
    if (!input.stuff.user) {
      return { status: 303, redirect: `/connexion?suivant=${encodeURIComponent(input.url.toString())}` };
    }

    return {
      props: {
        user: input.stuff.user,
        admin: input.stuff.admin
      }
    };
  }
</script>
<script lang="ts">
  import type { User } from "$lib/db/user";

  export let user: User;
  export let admin: boolean;
</script>

<p>
Bienvenue, {user.email}!
</p>

{#if admin}
<p><a href="/admin" link>Admin</a></p>
{/if}

<form action="/deconnexion" method="post" text-sunray text-3xl inline-block cursor-pointer>
  <input type="submit" value="Déconnexion"  cursor-pointer>
</form>