import { error, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import { addYears } from 'date-fns';
import { collections } from '$lib/server/database';
import { z } from 'zod';

export const actions: Actions = {
	default: async (event) => {
		const { password, email } = z
			.object({
				password: z.string().trim(),
				email: z.string().trim().email()
			})
			.parse(Object.fromEntries(await event.request.formData()));

		const user = await collections.users.findOne(
			{ email },
			{ collation: { locale: 'en', strength: 1 } }
		);

		if (!user) {
			throw error(404, "Utilisateur non trouvé pour l'email: " + email);
		}

		if (!(await bcrypt.compare(password as string, user.hash))) {
			throw error(401, 'Mauvais mot de passe');
		}

		let token = user.token;

		if (!token) {
			token = crypto.randomUUID();
			await collections.users.updateOne({ _id: user._id }, { $set: { token } });
		}

		event.cookies.set('bergereToken', token, {
			path: '/',
			sameSite: 'lax',
			secure: true,
			httpOnly: true,
			expires: addYears(new Date(), 1)
		});

		const next = event.url.searchParams.get('suivant');
		if (next) {
			throw redirect(303, next);
		}

		return { success: true };
	}
};
