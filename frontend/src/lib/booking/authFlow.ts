"use server";

import { signIn } from '@/auth'
import { baseUrl } from '@/lib/definitions'
import { nanoid } from "nanoid"

type EnsureUserResult =
  | { status: "created" }
  | { status: "exists"; callbackUrl: string }
  | { status: "error"; message: string }


export async function createUserSilently({
  fullName,
  email,
  phoneNumber,
}: {
  fullName: string
  email: string
  phoneNumber: string
}) {
  const randomPassword = nanoid(16)

  const payload = {
    full_name: fullName,
    email,
    phone_number: phoneNumber,
    password: randomPassword,
  }

  const response = await fetch(`${baseUrl}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    // Don't throw if user already exists — just continue
    if (error.detail?.includes("already exists")) {
      return { status: "exists" }
    } else {
      throw new Error(error.detail || "User creation failed")
    }
  }

  return { status: "created", email, password: randomPassword }
}


export async function ensureUserAndLogin({
  fullName,
  email,
  phoneNumber,
}: {
  fullName: string
  email: string
  phoneNumber: string
}): Promise<EnsureUserResult>  {

  const result = await createUserSilently({
    fullName,
    email,
    phoneNumber,
  })

  const usedPassword = result.status === "created" 
    ? result.password // new user, we know the password, which we set randomly
    : null // user is already registered in our system, we don't know the password

  if (!usedPassword) {
    // we will redirect to login so that user logs in first
    return {
      status: "exists",
      callbackUrl: "/booking?step=payment"
    }
  }

  // Try login (if user is new)
  try {
    const loginRes = await signIn("credentials", {
      email,
      password: usedPassword,
      redirect: false,
    })
  
    if (!loginRes?.ok) {
      throw new Error("Authentication failed after user creation.")
    }
  }
  catch (error) {
    return {
      status: "error",
      message: "Unable to log in after account creation.",
    };
  }

  return {status: "created"}
}


export async function getUserMe(access_token: string) {
  try {
    const response = await fetch(`${baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // console.warn("Failed to fetch user data:", error);
      return null; // Explicitly return null to indicate failure
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getUserMe:", error);
    return null;
  }
}
