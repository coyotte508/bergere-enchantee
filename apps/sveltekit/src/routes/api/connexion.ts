import type { EndpointOutput } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit/types/hooks";
import {users} from "$lib/db";
import {compare} from "bcryptjs";

export async function post({request}: RequestEvent): Promise<EndpointOutput> {
  const data = await request.formData();

  const email = data.get("email");

  const user = await users.findOne({email});

  if (!user) {
    return {
      status: 404,
      body: {
        message: "Utilisateur non trouvé"
      }
    };
  }

  const password = data.get("password");

  if (!await compare(password as string, user.hash)) {
    return {
      status: 403,
      body: {
        message: "Mauvais mot de passe"
      }
    };
  }

  return {
    status: 303,
    headers: {
      location: "/"
    }
  };
}