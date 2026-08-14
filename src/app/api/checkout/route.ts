import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Cuerpo de petición inválido' }, { status: 400 });
    }

    const { items, email, deliveryMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Definimos el estado específico según el método elegido
    const orderStatus = deliveryMethod === 'pickup' ? 'pending_pickup' : 'pending_shipping';

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Creamos la sesión en Stripe con el estado correcto en los metadatos
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email || undefined,
      shipping_address_collection: deliveryMethod === 'pickup' ? undefined : {
        allowed_countries: ['US', 'MX'],
      },
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        clerkUserId: userId,
        deliveryMethod: deliveryMethod || 'shipping',
        orderStatus: orderStatus, // Aquí viaja 'pending_shipping' o 'pending_pickup'
        itemsSummary: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error crítico en API Checkout:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}