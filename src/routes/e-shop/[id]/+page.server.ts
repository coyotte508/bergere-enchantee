import type { PageServerLoad, RequestEvent } from './$types';
import { collections } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const load: PageServerLoad = async (input) => {
	const product = await collections.products.findOne({
		_id: input.params.id,
		state: { $ne: 'draft' },
	});

	if (!product) {
		throw error(404, 'Produit non trouvé');
	}

	product.photos = await collections.pictures
		.find({ productId: input.params.id })
		.sort({ createdAt: 1 })
		.toArray();

	return {
		product,
		title: `${product.name} - ${product.price} €`,
		description: product.description,
		pictures: product.photos,
		type: 'og:product',
		price: product.price,
	};
};

async function addToCart({ params, request, locals }: RequestEvent) {
	const product = await collections.products.findOne({ _id: params.id, state: { $ne: 'draft' } });

	if (!product) {
		throw error(404, 'Produit non trouvé');
	}

	const formData = await request.formData();
	const { quantity } = z
		.object({
			quantity: z.number({ coerce: true }).int().min(1).max(product.stock),
		})
		.parse({
			quantity: formData.get('quantity') || '1',
		});

	let cart = await collections.carts.findOne({ sessionId: locals.sessionId });

	if (!cart) {
		cart = {
			_id: new ObjectId(),
			sessionId: locals.sessionId,
			items: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	const existingItem = cart.items.find((item) => item.productId === params.id);

	if (existingItem) {
		existingItem.quantity = Math.min(quantity + existingItem.quantity, product.stock);
	} else {
		cart.items.push({
			productId: params.id,
			quantity,
		});
	}

	await collections.carts.updateOne(
		{ _id: cart._id },
		{
			$set: {
				items: cart.items,
				updatedAt: new Date(),
			},
			$setOnInsert: {
				createdAt: new Date(),
				sessionId: locals.sessionId,
			},
		},
		{ upsert: true }
	);
}

export const actions = {
	buy: async (params) => {
		await addToCart(params);

		throw redirect(303, '/e-shop/commander');
	},

	addToCart: async (params) => {
		await addToCart(params);

		throw redirect(303, '/e-shop/panier');
	},
};
