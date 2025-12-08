import { collections } from '$lib/server/database.js';
import { picturesForProducts } from '$lib/server/photo.js';
import { calculateTotalWithShipping } from '$lib/utils/shipping.js';

export async function load(event) {
	const cart = await collections.carts.findOne({
		sessionId: event.locals.sessionId,
	});

	if (!cart?.items.length) {
		return {
			items: [],
		};
	}

	const products = await collections.products
		.find({
			_id: { $in: cart.items.map((item) => item.productId) || [] },
			state: { $ne: 'draft' },
		})
		.toArray();

	const productById = Object.fromEntries(products.map((product) => [product._id, product]));

	cart.items = cart.items.filter((item) => productById[item.productId]);

	const pictures = await picturesForProducts(products.map((product) => product._id));

	const pictureByProductId = Object.fromEntries(
		pictures.map((picture) => [picture.productId, picture])
	);

	const items = cart.items.map((item) => ({
		...item,
		picture: pictureByProductId[item.productId],
		product: {
			name: productById[item.productId].name,
			price: productById[item.productId].price,
			stock: productById[item.productId].stock,
			description: productById[item.productId].description,
			shippingPrice: productById[item.productId].shippingPrice || 0,
			canGroupShipping: productById[item.productId].canGroupShipping || false,
		},
	})) || [];

	const { subtotal, shipping, total } = calculateTotalWithShipping(items);

	return {
		title: "Panier d'achat",
		items,
		subtotal,
		shipping,
		total,
	};
}
