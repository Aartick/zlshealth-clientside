'use server'

import { signIn } from "@/app/auth";

export async function googleLogIn(action: string) {
  await signIn(action, { redirectTo: "/" });
}
