<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { Picture } from '$lib/types/Picture';
	import PictureComponent from '$lib/components/Picture.svelte';
	import { marked } from 'marked';
	import type { PageData } from './$types';
	import type { WorkshopPage } from '$lib/types/Page';
	import IconShipping from '~icons/ant-design/inbox-outlined';
	import IconLocation from '~icons/ant-design/environment-outlined';
	import IconClock from '~icons/ant-design/clock-circle-outlined';

	export let data: PageData;

	const pageData = data.pageData as WorkshopPage;
	const pictures: Picture[] = data.pictures;
	const horaires = data.horaires;
</script>

<Container>
	<section class="relative mt-12 flex flex-col lg:h-[36rem] lg:flex-row">
		<div class="w-full lg:w-3/6 h-full flex flex-col justify-evenly gap-6 lg:gap-0">
			<h2 class="text-oxford text-7xl" style="mix-blend-mode: color-burn;">L'atelier</h2>
			<ul class="text-oxford">
				<li class="flex items-center">
					<IconLocation class="inline-block mr-2" />
					<div class="inline-block">29 rue Traverse, <br />29200 Brest</div>
				</li>
				<li class="flex items-center mt-1">
					<IconShipping class="inline-block mr-2" />
					Atelier showroom
				</li>
				<li class="flex mt-2">
					<IconClock class="inline-block mr-2 mt-1" />
					<div class="flex flex-col space-y-1">
						<div class="text-sm font-medium">Horaires d'ouverture :</div>
						<ul class="text-sm space-y-1 list-none">
							<li>Lundi : {horaires.lundi}</li>
							<li>Mardi : {horaires.mardi}</li>
							<li>Mercredi : {horaires.mercredi}</li>
							<li>Jeudi : {horaires.jeudi}</li>
							<li>Vendredi : {horaires.vendredi}</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<PictureComponent
			picture={pictures.find((p) => p._id === pageData.pictures['photo-1'])}
			sizes="(max-width: 1200px) 50vw, 600px"
			grow
			basis-0
			class="rounded-3xl w-full lg:w-3/6 h-72 lg:h-full object-cover mt-6 lg:mt-0"
		/>
	</section>

	<section class="md:min-h-[24rem] md:max-h-[40rem] mt-16 flex flex-wrap md:mb-16">
		<div class="w-full md:w-[50%] h-[24rem] md:h-auto md:max-h-[40rem]">
			<div class="md:pr-12 h-full">
				<div class="w-full h-full relative">
					<div
						class="rounded-3xl w-full h-full bg-sunray absolute left-4 top-4"
						style="z-index: -1"
					/>
					<PictureComponent
						picture={pictures.find((p) => p._id === pageData.pictures['photo-2'])}
						sizes="(max-width: 1024px) 50vw, 512px"
						class="rounded-3xl w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>
		<div class="w-full md:w-3/6 flex flex-col relative">
			<h2 class="text-oxford text-4xl mt-16 md:mt-6 lg:mt-12">
				L'atelier, mon endroit de <span class="text-sunray">création</span>
			</h2>
			<div class="grow justify-center marked">
				<!-- eslint-disable svelte/no-at-html-tags -->
				{@html marked(pageData.text['texte-1'])}
			</div>
		</div>
	</section>
</Container>

<section class="my-12 w-full text-center flex flex-col items-center">
	<h2 class="text-4xl text-oxford mb-12"><span class="text-sunray">Mon</span> atelier</h2>
	<PictureComponent
		picture={pictures.find((p) => p._id === pageData.pictures['photo-3'])}
		class="h-[32rem] w-full object-cover"
	/>
</section>

<Container class="marked">
	<!-- eslint-disable svelte/no-at-html-tags -->
	{@html marked(pageData.text['texte-2'])}

	<div class="my-12 mb-20 text-center">
		<a href="/e-shop" class="btn-sunray text-xl">e-shop</a>
	</div>
</Container>
