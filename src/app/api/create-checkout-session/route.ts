import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { eventTitle, userEmail, ticketQuantity, pricePerTicket } = await req.json();

    console.log("Incoming request data:", { eventTitle, userEmail, ticketQuantity, pricePerTicket });

    if (!eventTitle || !userEmail || ticketQuantity == null || !pricePerTicket) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const totalAmount = pricePerTicket * ticketQuantity * 100;

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
    }
    
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : process.env.NEXT_PUBLIC_BASE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
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
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });


    return NextResponse.json({ url: session.url });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Stripe Error:", errorMessage);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}
