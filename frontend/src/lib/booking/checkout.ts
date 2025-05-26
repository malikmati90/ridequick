import axios from "axios"
import { CreateSessionParams } from "../../../types/booking"
import { baseUrl } from "../definitions"


export async function createStripeCheckoutSession(data: CreateSessionParams) {
  const response = await axios.post(
    baseUrl + "/payments/create-checkout-session",
    data
  )

  return response.data?.url
}
