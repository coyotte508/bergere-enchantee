/// <reference types="@sveltejs/kit" />

import type { Page } from "$lib/db/page";
import type { Picture } from "$lib/db/picture";
import type { User } from "$lib/db/user";

/* eslint-disable @typescript-eslint/no-empty-interface */

declare namespace App {
  interface Locals {
    user?: User;
    admin: boolean
  }

  interface Platform {}

  interface Session {
    user?: User
  }

  interface Stuff {
    user: User;
    admin: boolean;
    pageData: Page;
    pictures: Picture[]
  }
}