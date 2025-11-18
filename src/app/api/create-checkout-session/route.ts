import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { eventTitle, userEmail, ticketQuantity, pricePerTicket } =
      await req.json();

    console.log("Incoming request data:", {
      eventTitle,
      userEmail,
      ticketQuantity,
      pricePerTicket,
    });

    if (
      !eventTitle ||
      !userEmail ||
      ticketQuantity == null ||
      !pricePerTicket
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = pricePerTicket * ticketQuantity * 100;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }
    // If NEXT_PUBLIC_BASE_URL is set, use it; otherwise derive from the request.
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ??
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    console.log("Stripe redirect origin:", origin);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: eventTitle },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Stripe Error:", errorMessage);
    return NextResponse.json(
      { error: "Stripe session creation failed" },
      { status: 500 }
    );
  }
}
