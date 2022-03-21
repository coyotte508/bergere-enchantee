<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit";

  export function load(input: LoadInput): LoadOutput {
    return { status: 302, redirect: "/admin/pages" };
  }
</script>