import { mg } from '$lib/server/mail';
import { z } from 'zod';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const parsed = z
			.object({
				email: z.string().email(),
				message: z.string().trim().min(20),
				firstName: z.string().trim().min(2),
				lastName: z.string().trim().min(2),
			})
			.safeParse(Object.fromEntries(await event.request.formData()));

		if (!parsed.success) {
			return {
				status: 400,
				body: {
					error: 'Veuillez remplir tous les champs',
				},
			};
		}

		const { email, message, firstName, lastName } = parsed.data;

		const split = `${firstName} ${lastName}`.trim().split(/\s+/);

		if (split.length > 2 && split[0] === split[1]) {
			// Spammers seem to have this problem :shrug:
			return {
				success: true,
			};
		}

		await mg.messages.create('mails.bergereenchantee.fr', {
			from: 'Formulaire de contact <contact@mails.bergereenchantee.fr>',
			to: ['contact@bergereenchantee.fr'],
			subject: `Message de ${firstName} ${lastName}`,
			'h:Reply-To': email,
			text: message,
			'o:tag': 'contact',
		});

		return { success: true };
	},
};
