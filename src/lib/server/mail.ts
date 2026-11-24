import { env } from '$env/dynamic/private';
import { building, dev } from '$app/environment';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

export function validateMailConfiguration() {
	if (!dev && !building && !env.MAILGUN_API_KEY?.trim()) {
		throw new Error(
			'[configuration] Démarrage refusé : MAILGUN_API_KEY est absente en production.'
		);
	}
}

const mailgun = new Mailgun(formData);

type MailgunClient = ReturnType<typeof mailgun.client>;
let client: MailgunClient | undefined;

// Initialise only when sending: build analysis must not require mail credentials.
export const mg = {
	messages: {
		async create(...args: Parameters<MailgunClient['messages']['create']>) {
			const key = env.MAILGUN_API_KEY?.trim();
			if (!key) {
				if (dev) {
					// Do not log recipients or message contents (personal data).
					console.warn('[mail] Envoi ignoré en développement : MAILGUN_API_KEY absente.');
					return;
				}
				throw new Error('MAILGUN_API_KEY est requise pour envoyer des e-mails en production.');
			}

			client ??= mailgun.client({
				username: 'api',
				key,
				url: 'https://api.eu.mailgun.net',
			});
			return client.messages.create(...args);
		},
	},
};
