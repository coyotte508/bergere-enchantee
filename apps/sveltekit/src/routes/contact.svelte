<script context="module" lang="ts">
  export const load: Load = (input) => {
    return {
      props: {
        pageData: input.stuff.pageData,
        pictures: input.stuff.pictures
      }
    };
  };
</script>

<script lang="ts">
  import type { Page } from "$lib/db/page";
  import type { Load } from "@sveltejs/kit";
  import Container from "$lib/components/Container.svelte";
  import { marked } from "marked";

  export let pageData: Page;
</script>

<Container>
  <div text-center>
    <iframe title="Carte" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21218.095703681618!2d-4.298313461852108!3d48.33626987923979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4816b59434b9b9a1%3A0x497027a2d3e4d4db!2s39%20Rte%20de%20l&#39;Argoat%2C%2029460%20Logonna-Daoulas!5e0!3m2!1sen!2sfr!4v1642367156653!5m2!1sen!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
  </div>
  
  <div max-w-xl mx-auto pt-3>
    {@html marked(pageData.text.description)}
  
    <ol pt-3>
      <li py-1>📍 <address inline>39 route de l'Argoat, 29460 Logonna Daoulas <i>(dépôt et retrait uniquement)</i></address></li>
      <li py-1>📱 <a href="tel:+33774521115">07 74 52 11 15</a></li>
      <li py-1>📧 <a href="mailto:contact@bergereenchantee.fr">contact@bergereenchantee.fr</a></li>
      <li py-1 flex items-center gap-1><div class="i-il-instagram" inline-block />  <a href="https://instagram.com/bergere.enchantee">bergere.enchantee</a></li>
    </ol>
  </div>
</Container>
