import { collections } from '$lib/server/database.js';
import { picturesForProducts } from '$lib/server/photo.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const cart = await collections.carts.findOne({
		sessionId: event.locals.sessionId,
	});

	// Redirect to cart if empty
	if (!cart?.items.length) {
		throw redirect(302, '/e-shop/panier');
	}

	const products = await collections.products
		.find({
			_id: { $in: cart.items.map((item) => item.productId) || [] },
			state: { $ne: 'draft' },
		})
		.toArray();

	const productById = Object.fromEntries(products.map((product) => [product._id, product]));

	// Filter out items for products that no longer exist
	cart.items = cart.items.filter((item) => productById[item.productId]);

	const pictures = await picturesForProducts(products.map((product) => product._id));

	const pictureByProductId = Object.fromEntries(
		pictures.map((picture) => [picture.productId, picture])
	);

	const items =
		cart.items.map((item) => ({
			...item,
			picture: pictureByProductId[item.productId],
			product: {
				name: productById[item.productId].name,
				price: productById[item.productId].price,
				stock: productById[item.productId].stock,
				description: productById[item.productId].description,
			},
		})) || [];

	// Calculate total
	const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

	return {
		title: 'Finaliser la commande',
		items,
		total,
	};
}
