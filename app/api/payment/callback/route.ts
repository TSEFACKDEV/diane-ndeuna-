// app/api/payment/callback/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPayment } from "@/lib/validation/payment";
import { MembershipStatus, PaymentStatus } from "@/lib/generated/prisma/browser";


export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentId = searchParams.get("payment_id") || searchParams.get("id");
    const userId = searchParams.get("user_id") || searchParams.get("userId");

    if (!paymentId || !userId) {
      return NextResponse.redirect(
        new URL("/communaute/ressources-membres?error=invalid_callback", request.url)
      );
    }

    // Vérifier le statut du paiement
    const verification = await verifyPayment(paymentId);

    // Mettre à jour le paiement en base
    await prisma.payment.updateMany({
      where: { externalPaymentId: paymentId, userId },
      data: {
        status:
          verification.status === "completed"
            ? PaymentStatus.COMPLETED
            : verification.status === "failed"
            ? PaymentStatus.FAILED
            : PaymentStatus.PENDING,
      },
    });

    // Si paiement réussi, activer le membership
    if (verification.status === "completed") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          membershipStatus: MembershipStatus.ACTIVE,
        },
      });
    }

    const redirectUrl = new URL("/communaute/ressources-membres", request.url);
    if (verification.status === "completed") {
      redirectUrl.searchParams.set("success", "true");
    } else if (verification.status === "failed") {
      redirectUrl.searchParams.set("error", "payment_failed");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Erreur callback paiement:", error);
    return NextResponse.redirect(
      new URL("/communaute/ressources-membres?error=server_error", request.url)
    );
  }
}