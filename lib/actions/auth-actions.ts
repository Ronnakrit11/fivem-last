"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const signUp = async (email: string, password: string, name: string, callbackURL?: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      callbackURL: callbackURL || "/dashboard",
    },
  });

  return result;
};

export const signIn = async (email: string, password: string, callbackURL?: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: callbackURL || "/dashboard",
    },
  });

  return result;
};

export const signInSocial = async (provider: "github" | "google", callbackURL?: string) => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: callbackURL || "/dashboard?login=success",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
