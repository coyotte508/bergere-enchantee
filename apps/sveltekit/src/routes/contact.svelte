<script lang="ts" context="module">
  export const load: Load = async (input) => {
    return {
      stuff: {
        ...input.stuff,
        error: input.props.error
      },
      props: input.props
    };
  };
</script>

<script lang="ts">
  import type { ContactPage } from "$lib/db/page";
  import Container from "$lib/components/Container.svelte";
  import { marked } from "marked";
  import { page } from "$app/stores";
  import type { Load } from "@sveltejs/kit";
  import type { Picture } from "$lib/db/picture";
  import PictureComponent from "$lib/components/Picture.svelte";

  const pageData: ContactPage = $page.stuff.pageData;
  const pictures: Picture[] = $page.stuff.pictures;
  export let success: boolean;
</script>

<Container class="mb-6">
  <section relative class="lg:h-xl" mt-12 flex>
    <img src="/triangles.svg" alt="Triangles" pointer-events-none select-none absolute hidden lg:block class="h-5/6" style="left: 50%; top: 50%; transform: translate(-50%, -50%) scaleX(-1); z-index: -1">
    <PictureComponent picture={pictures.find(p => p._id === pageData.pictures["photo-garde"])} sizes="(max-width: 1200px) 50vw, 600px" grow basis-0 hidden class="rounded-3xl h-full object-cover w-3/6 lg:block" />
    <div class="lg:w-3/6" h-full flex flex-col justify-evenly lg:pl-12>
      <h2 text-oxford text-7xl style="mix-blend-mode: color-burn;" mb-7 lg:mb-0>Contact</h2>
      <ul text-oxford>
        <li flex items-center><div class="i-ant-design-phone-outlined" inline-block mr-2 /> <a rel="external" href="tel:+33774521115">07 74 52 11 15</a></li>
        <li flex items-center mt-2><div class="i-ant-design-mail-outlined" inline-block mr-2 /> <a rel="external" href="mailto:contact@bergereenchantee.fr">contact@bergereenchantee.fr</a></li>
        <li flex mt-2><div class="i-ant-design-clock-circle-outlined" inline-block mr-2 lg:mt-1 /> le lundi mardi jeudi vendredi de 9h à 17h30 et le mercredi de 9h à 12h</li>
      </ul>
    </div>
  </section>
  <div pt-3>
    {@html marked(pageData.text.description)}
  </div>

  {#if success}
    <div class="border border-blue-500 bg-blue-300 rounded-lg pa-2">Votre message a bien été envoyé. <br><br> Daphné vous répondra rapidement.</div>
  {:else}
    <form method="post" text-oxford font-semibold text-lg>
      <div mt-4>
        <label for="lastName" block>Nom</label>
        <input type="text" name="lastName" id="lastName" placeholder="Nom" input box-border style="max-width: 100% !important" required>
      </div>

      <div mt-4>
        <label for="firstName" block>Prénom</label>
        <input type="text" name="firstName" id="firstName" placeholder="Prénom" input box-border style="max-width: 100% !important" required>
      </div>

      <div mt-4>
        <label for="email" block>Mail</label>
        <input type="email" name="email" id="email" placeholder="Adresse mail" input box-border style="max-width: 100% !important" required>
      </div>

      <div mt-4>
        <label for="message" block>Message</label>
        <textarea name="message" id="message" cols="30" rows="5" input box-border style="max-width: 100% !important" placeholder="Votre message" required></textarea>
      </div>

      <div w-full flex mt-4>
        <button type="submit" btn ml-auto cursor-pointer>
          Envoyer
        </button>
      </div>
      
    </form>
  {/if}
</Container>
