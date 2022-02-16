/// <reference types="@sveltejs/kit" />

import type { User } from "$lib/db/user";

interface Session {
  user?: User
}