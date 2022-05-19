import Mailgun from "mailgun.js";
import * as formData from "form-data";

const mailgun = new Mailgun(formData);

export const mg = mailgun.client({username: "api", key: process.env.MAILGUN_API_KEY, url: "https://api.eu.mailgun.net"});