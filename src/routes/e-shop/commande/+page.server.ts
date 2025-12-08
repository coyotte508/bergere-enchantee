import { collections } from '$lib/server/database.js';
import { picturesForProducts } from '$lib/server/photo.js';
import { redirect } from '@sveltejs/kit';
import { calculateTotalWithShipping } from '$lib/utils/shipping.js';
import { mg } from '$lib/server/mail';
import { z } from 'zod';
import type { Actions } from './$types.js';
import { generateId } from '$lib/utils/generateId.js';
import type { Order, OrderItem } from '$lib/types/Order.js';
import { getNextOrderNumber } from '$lib/server/orderCounter.js';
import { generateAccessKey } from '$lib/utils/generateAccessKey.js';

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
				shippingPrice: productById[item.productId].shippingPrice || 0,
				canGroupShipping: productById[item.productId].canGroupShipping || false,
			},
		})) || [];

	const { subtotal, shipping, total } = calculateTotalWithShipping(items);

	return {
		title: 'Finaliser la commande',
		items,
		subtotal,
		shipping,
		total,
	};
}

export const actions: Actions = {
	default: async (event) => {
		// Get cart data for order details
		const cart = await collections.carts.findOne({
			sessionId: event.locals.sessionId,
		});

		if (!cart?.items.length) {
			throw redirect(302, '/e-shop/panier');
		}

		// Validate form data
		const parsed = z
			.object({
				email: z.string().email(),
				firstName: z.string().trim().min(2),
				lastName: z.string().trim().min(2),
				phone: z.string().optional(),
				message: z.string().optional(),
			})
			.safeParse(Object.fromEntries(await event.request.formData()));

		if (!parsed.success) {
			return {
				error: 'Veuillez remplir tous les champs obligatoires',
			};
		}

		const { email, firstName, lastName, phone, message } = parsed.data;

		// Anti-spam check (same as contact form)
		const split = `${firstName} ${lastName}`.trim().split(/\s+/);
		if (split.length > 2 && split[0] === split[1]) {
			return { success: true };
		}

		// Get product details for the order
		const products = await collections.products
			.find({
				_id: { $in: cart.items.map((item) => item.productId) || [] },
				state: { $ne: 'draft' },
			})
			.toArray();

		const productById = Object.fromEntries(products.map((product) => [product._id, product]));

		const items = cart.items.map((item) => ({
			...item,
			product: {
				name: productById[item.productId].name,
				price: productById[item.productId].price,
				stock: productById[item.productId].stock,
				description: productById[item.productId].description,
				shippingPrice: productById[item.productId].shippingPrice || 0,
				canGroupShipping: productById[item.productId].canGroupShipping || false,
			},
		}));

		const { subtotal, shipping, total } = calculateTotalWithShipping(items);

		// Create order items with full product snapshots
		const orderItems: OrderItem[] = items.map((item) => ({
			productId: item.productId,
			quantity: item.quantity,
			productSnapshot: productById[item.productId], // Store the full product
			itemSubtotal: item.product.price * item.quantity,
			itemShipping: item.product.canGroupShipping ? 0 : item.product.shippingPrice || 0, // Individual shipping cost
		}));

		// Get next order number and create the order
		const orderNumber = await getNextOrderNumber();
		const accessKey = generateAccessKey();
		const orderId = generateId(`order-${orderNumber}`);
		const order: Order = {
			_id: orderId,
			orderNumber,
			accessKey,
			customer: {
				firstName,
				lastName,
				email,
				phone,
			},
			items: orderItems,
			subtotal,
			totalShipping: shipping,
			total,
			status: 'pending',
			customerMessage: message,
			sessionId: event.locals.sessionId,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Save order to database
		await collections.orders.insertOne(order);

		// Create order summary for email
		const orderDetails = items
			.map(
				(item) =>
					`- ${item.product.name} x${item.quantity} = ${(
						item.product.price * item.quantity
					).toLocaleString('fr', {
						currency: 'EUR',
						style: 'currency',
					})}`
			)
			.join('\n');

		const emailBody = `
Nouvelle commande de ${firstName} ${lastName}

INFORMATIONS CLIENT:
- Nom: ${firstName} ${lastName}
- Email: ${email}
${phone ? `- Téléphone: ${phone}` : ''}

DÉTAILS DE LA COMMANDE:
${orderDetails}

TOTAUX:
- Sous-total: ${subtotal.toLocaleString('fr', { currency: 'EUR', style: 'currency' })}
- Frais de livraison (hors Finistère): ${shipping.toLocaleString('fr', { currency: 'EUR', style: 'currency' })}
- TOTAL: ${total.toLocaleString('fr', { currency: 'EUR', style: 'currency' })}

${message ? `MESSAGE DU CLIENT:\n${message}` : ''}

SUIVI DE COMMANDE:
Le client peut suivre sa commande à l'adresse: ${event.url.origin}/commande/${orderNumber}/${accessKey}

---
Cette commande a été passée via le site web.
		`.trim();

		// Send email using the same system as contact form
		await mg.messages.create('mails.bergereenchantee.fr', {
			from: 'Commande e-shop <contact@mails.bergereenchantee.fr>',
			to: ['contact@bergereenchantee.fr'],
			subject: `Nouvelle commande #${orderNumber} - ${firstName} ${lastName} - ${total.toLocaleString('fr', { currency: 'EUR', style: 'currency' })}`,
			'h:Reply-To': email,
			text: `Commande #${orderNumber}\n\n${emailBody}`,
			'o:tag': 'order',
		});

		// Clear the cart after successful order
		await collections.carts.deleteOne({ sessionId: event.locals.sessionId });

		return { success: true, orderId, orderNumber, accessKey };
	},
};
