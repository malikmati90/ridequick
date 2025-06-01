"use client";

import { CreateSessionParams } from "../../../types/booking";
import { baseUrl } from "../definitions";


interface StripeSessionResponse {
  sessionUrl?: string;
  error?: string;
}

export async function createStripeCheckoutSession(
  data: CreateSessionParams, 
  token: string
): Promise<StripeSessionResponse> {

  try {
    const response = await fetch(`${baseUrl}/payments/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return { error: 'Failed to create Stripe session. Please try again later.' };
    }

    const sessionData = await response.json();
    
    if (!sessionData?.url) {
      return { error: 'Stripe session URL missing from response.' };
    }

    return { sessionUrl: sessionData.url };
    
  } catch (err) {
    console.error("Checkout API error:", err);
    return { error: 'Unexpected server error. Please try again.' };
  }
}