import { MAILGUN_API_KEY } from '$env/static/private';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({
	username: 'api',
	key: MAILGUN_API_KEY,
	url: 'https://api.eu.mailgun.net',
});
