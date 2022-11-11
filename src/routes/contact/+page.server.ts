import { mg } from '$lib/server/mail';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const body = await event.request.formData();
		if (
			!body.get('email') ||
			!body.get('message') ||
			!body.get('firstName') ||
			!body.get('lastName')
		) {
			return {
				status: 400,
				body: {
					error: 'Veuillez remplir tous les champs'
				}
			};
		}

		const firstName = body.get('firstName')!.toString().trim();
		const lastName = body.get('lastName')!.toString().trim();
		const message = body.get('message')!.toString().trim();
		const email = body.get('email')!.toString().trim();

		await mg.messages.create('mails.bergereenchantee.fr', {
			from: 'Formulaire de contact <contact@mails.bergereenchantee.fr>',
			to: ['contact@bergereenchantee.fr'],
			subject: `Message de ${firstName} ${lastName}`,
			'h:Reply-To': email,
			text: message,
			'o:tag': 'contact'
		});

		return { success: true };
	}
};
