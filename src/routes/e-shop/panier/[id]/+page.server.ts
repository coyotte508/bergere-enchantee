import { collections } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const PRODUCT_NOT_IN_CART = "Ce produit n'est pas dans le panier";
const PRODUCT_NOT_FOUND = "Ce produit n'existe pas";
const PRODUCT_NOT_IN_STOCK = "Ce produit n'est plus en stock";

export const actions = {
	remove: async ({ locals, params, request }) => {
		const cart = await collections.carts.findOne({ sessionId: locals.sessionId });

		if (!cart) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		const item = cart.items.find((i) => i.productId === params.id);

		if (!item) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		cart.items = cart.items.filter((it) => it !== item);

		await collections.carts.updateOne(
			{ _id: cart._id },
			{ $set: { items: cart.items, updatedAt: new Date() } }
		);

		throw redirect(303, request.headers.get('referer') || '/e-shop/panier');
	},
	increase: async ({ locals, params, request }) => {
		const cart = await collections.carts.findOne({ sessionId: locals.sessionId });

		if (!cart) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		const item = cart.items.find((i) => i.productId === params.id);

		if (!item) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		const product = await collections.products.findOne({
			_id: item.productId,
			state: { $ne: 'draft' }
		});

		if (!product) {
			await collections.carts.updateOne({ _id: cart._id }, { $pull: { items: item } });
			throw error(404, PRODUCT_NOT_FOUND);
		}

		if (!product.stock) {
			await collections.carts.updateOne({ _id: cart._id }, { $pull: { items: item } });
			throw error(400, PRODUCT_NOT_IN_STOCK);
		}

		const formData = await request.formData();

		const { quantity } = z
			.object({
				quantity: z.number({ coerce: true }).int().min(1)
			})
			.parse({
				quantity: formData.get('quantity')
			});

		item.quantity = Math.min(quantity + 1, product.stock);

		await collections.carts.updateOne(
			{ _id: cart._id },
			{ $set: { items: cart.items, updatedAt: new Date() } }
		);

		throw redirect(303, request.headers.get('referer') || '/e-shop/panier');
	},
	decrease: async ({ request, locals, params }) => {
		const cart = await collections.carts.findOne({ sessionId: locals.sessionId });

		if (!cart) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		const item = cart.items.find((i) => i.productId === params.id);

		if (!item) {
			throw error(404, PRODUCT_NOT_IN_CART);
		}

		const product = await collections.products.findOne({
			_id: item.productId,
			state: { $ne: 'draft' }
		});

		if (!product) {
			await collections.carts.updateOne({ _id: cart._id }, { $pull: { items: item } });
			throw error(404, PRODUCT_NOT_FOUND);
		}

		const formData = await request.formData();
		const { quantity } = z
			.object({
				quantity: z.number({ coerce: true }).int().min(1)
			})
			.parse({
				quantity: formData.get('quantity')
			});

		item.quantity = Math.min(quantity - 1, product.stock);

		if (item.quantity === 0) {
			cart.items = cart.items.filter((it) => it !== item);
		}

		await collections.carts.updateOne(
			{ _id: cart._id },
			{ $set: { items: cart.items, updatedAt: new Date() } }
		);

		throw redirect(303, request.headers.get('referer') || '/e-shop/panier');
	}
};
