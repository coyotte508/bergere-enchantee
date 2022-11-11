import { error, redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email').trim();

		const user = await users.findOne({ email }, { collation: { locale: 'en', strength: 1 } });

		if (!user) {
			throw error(404, "Utilisateur non trouvé pour l'email: " + email);
		}

		const password = data.get('password').trim();

		if (!(await bcrypt.compare(password as string, user.hash))) {
			throw error(401, 'Mauvais mot de passe');
		}

		let token = user.token;

		if (!token) {
			token = crypto.randomUUID();
			await users.updateOne({ _id: user._id }, { $set: { token } });
		}

		event.cookies.set('bergereToken', token, {
			path: '/',
			sameSite: 'lax',
			secure: true,
			httpOnly: true,
			maxAge: 24 * 3600 * 365 * 3
		});

		if (event.url.searchParams.get('suivant')) {
			throw redirect(303, event.url.searchParams.get('suivant'));
		}

		return { success: true };
	}
};
