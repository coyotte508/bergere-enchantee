<script lang="ts">
  import { onMount } from "svelte";

  let carousel: HTMLDivElement;
  let currentIndex = 0;
  let dots = 0;
  
  onMount(() => {
    dots = carousel.children.length;
  });

</script>

<div bind:this={carousel} flex flex-col {...$$restProps}>
  <div flex flex-row w-full class="carousel-content"> 
    <slot />
  </div>
</div>

<style>
  .carousel, .carousel-content {
    
  }

  .carousel-content {
    margin-left: -25%;
  }

  :global(.carousel-content > *) {
    color: red;
    width: 50%;
    min-width: 50%;
    border: 1px solid green;
  }
</style>