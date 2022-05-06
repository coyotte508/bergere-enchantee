
<script lang="ts">
  import { tick } from "svelte";
  export let items = []; // pass in data if it's dynamically updated
  let grids = []; 
  let masonryElement: HTMLElement;
  
  const refreshLayout = async () => {
    masonryElement.querySelectorAll("img").forEach(img => {
      if (img.complete) {
        img.classList.add("loaded");
      }
    });

    grids.forEach(async grid => {
      /* get the post relayout number of columns */
      let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(" ").length;
      
      grid.items.forEach(c => {
        let new_h = c.getBoundingClientRect().height;
        
        if(new_h !== +c.dataset.h) {
          c.dataset.h = new_h;
          grid.mod++;
        }
      });
      
      /* if the number of columns has changed */
      if(grid.ncol !== ncol || grid.mod) {
        /* update number of columns */ 
        grid.ncol = ncol;
        /* revert to initial positioning, no margin */
        grid.items.forEach(c => c.style.removeProperty("margin-top"));
        /* if we have more than one column */
        if(grid.ncol > 1) {
          grid.items.slice(ncol).forEach((c, i) => {
            let prev_fin = grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */, 
                  curr_ini = c.getBoundingClientRect().top /* top edge of current item */;
            
            c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
          });
        }
        
        grid.mod = 0;
      }
    });
  };
  
  const calcGrid = async (_masonryArr) => {
    await tick();
    if(_masonryArr.length && getComputedStyle(_masonryArr[0]).gridTemplateRows !== "masonry") {
      grids = _masonryArr.map(grid => {
        return {
          _el: grid, 
          gap: parseFloat(getComputedStyle(grid).gridRowGap),
          items: [...grid.childNodes].filter(c => c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1), 
          ncol: 0, 
          mod: 0
        };
      });
      refreshLayout(); /* initial load */
    }
  };
  
  $: if(masonryElement) {
    calcGrid([masonryElement]);
  }
  
  $: if(items) { // update if items are changed
    masonryElement = masonryElement; // refresh masonryElement

    if (masonryElement) {
      const images = masonryElement.querySelectorAll("img");

      images.forEach(img => {
        img.removeEventListener("load", refreshLayout);
        img.addEventListener("load", refreshLayout);
      });
    }
  }
</script>

<svelte:window on:resize={refreshLayout} on:load={refreshLayout}></svelte:window>

<div bind:this={masonryElement} class="__grid--masonry">
  <slot></slot>
</div>

<!-- 
$w: var(--col-width); // minmax(Min(20em, 100%), 1fr);
$s: var(--grid-gap); // .5em;
-->

<style>
:global(.__grid--masonry) {
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--col-width, minmax(Min(20em, 100%), 1fr)));
  grid-template-rows: masonry;
  justify-content: start;
  grid-gap: var(--grid-gap, 0.5em);
}

:global(.__grid--masonry > *) { 
  align-self: start
}
</style>