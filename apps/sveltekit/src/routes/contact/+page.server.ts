throw new Error("@migration task: Update +page.server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");

import { mg } from "$lib/mail";
import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async ({request}) => {
  const body = await request.formData();
  if (!body.get("email") || !body.get("message") || !body.get("firstName") || !body.get("lastName")) {
    return {
      status: 400,
      body: {
        error: "Veuillez remplir tous les champs"
      }
    };
  }

  const firstName = body.get("firstName").toString().trim();
  const lastName = body.get("lastName").toString().trim();
  const message = body.get("message").toString().trim();
  const email = body.get("email").toString().trim();

  await mg.messages.create("mails.bergereenchantee.fr", {
    from: "Formulaire de contact <contact@mails.bergereenchantee.fr>",
    to: ["contact@bergereenchantee.fr"],
    subject: `Message de ${firstName} ${lastName}`,
    "h:Reply-To": email,
    text: message,
    "o:tag": "contact"
  });

  return {status: 201, body: {success: true}};
};