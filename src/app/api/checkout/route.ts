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

    // 👈 Recibimos también deliveryFee del frontend
    const { items, email, deliveryMethod, taxAmount, deliveryFee } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // Preparar items para Stripe
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

    // Agregar el costo de envío (Delivery Fee) a Stripe si es mayor a 0
    if (deliveryFee && deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Standard Shipping Fee',
            images: [],
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Agregar el impuesto calculado como una línea adicional en Stripe si es mayor a 0
    if (taxAmount && taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Estimated Sales Tax (8.25%)',
            images: [],
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    // Crear sesión en Stripe guardando el deliveryMethod y los items en los metadata
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
        itemsJson: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error crítico en API Checkout:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}