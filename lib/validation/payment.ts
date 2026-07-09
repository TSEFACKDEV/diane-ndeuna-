// lib/payment.ts
import axios from "axios";

const PAYMENT_API_URL = process.env.PAYMENT_API_URL;
const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;

if (!PAYMENT_API_URL || !PAYMENT_API_KEY) {
  console.warn("⚠️ Variables PAYMENT_API_URL ou PAYMENT_API_KEY non configurées.");
}

export interface InitiatePaymentInput {
  amount: number;
  currency: string;
  email: string;
  fullName: string;
  phone?: string;
  description: string;
  callbackUrl: string;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  redirectUrl: string;
  status: "pending" | "completed" | "failed";
}

export async function initiatePayment(
  input: InitiatePaymentInput
): Promise<InitiatePaymentResponse> {
  try {
    const { data } = await axios.post(
      `${PAYMENT_API_URL}/initiate`,
      {
        amount: input.amount,
        currency: input.currency,
        email: input.email,
        customer_name: input.fullName,
        customer_phone: input.phone || "",
        description: input.description,
        callback_url: input.callbackUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": PAYMENT_API_KEY,
        },
      }
    );

    return {
      paymentId: data.payment_id || data.id || "pending",
      redirectUrl: data.redirect_url || data.payment_url || "",
      status: data.status || "pending",
    };
  } catch (error) {
    console.error("Erreur lors de l'initiation du paiement:", error);
    throw new Error("Impossible d'initier le paiement. Veuillez réessayer.");
  }
}

export async function verifyPayment(paymentId: string): Promise<{ status: "pending" | "completed" | "failed" }> {
  try {
    const { data } = await axios.get(`${PAYMENT_API_URL}/verify/${paymentId}`, {
      headers: {
        "X-API-Key": PAYMENT_API_KEY,
      },
    });

    return {
      status: data.status || "pending",
    };
  } catch (error) {
    console.error("Erreur lors de la vérification du paiement:", error);
    return { status: "pending" };
  }
}