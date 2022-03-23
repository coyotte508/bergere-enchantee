import type { EndpointOutput, RequestEvent } from "@sveltejs/kit";
import {users} from "$lib/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

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

  if (!await bcrypt.compare(password as string, user.hash)) {
    return {
      status: 403,
      body: {
        message: "Mauvais mot de passe"
      }
    };
  }

  const token = nanoid();
  await users.updateOne({_id: user._id}, {$set: {token}});

  return {
    status: 303,
    headers: {
      location: data.get("redirect") as string ?? "/",
      "Set-Cookie": `bergereToken=${JSON.stringify(token)}; Max-Age=${
        24 * 3600 * 365 * 3
      }; Path=/; SameSite=Lax; Secure`
    }
  };
}