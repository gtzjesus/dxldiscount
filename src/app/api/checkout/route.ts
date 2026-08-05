import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

// Inicialización limpia sin forzar versión con sufijos extraños
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe maneja los precios en centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      
      // 👉 ESTO ES LO ÚNICO QUE FALTABA: Pide dirección de envío obligatoria
      shipping_address_collection: {
        allowed_countries: ['US', 'MX'], // Ajusta los países de envío según tu tienda
      },

      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        clerkUserId: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error en Stripe Checkout:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}