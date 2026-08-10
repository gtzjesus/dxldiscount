import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('SUPABASE ERROR: Faltan las variables de entorno de Supabase');
      return NextResponse.json({ error: 'Error de configuración del servidor' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // 1. PREPARAR ITEMS PARA STRIPE PRIMERO
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

    // 2. CREAR LA SESIÓN EN STRIPE ANTES DE INSERTAR EN SUPABASE (Estructura original idéntica)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email || undefined,
      // Solo pedimos dirección de envío si el método es 'shipping'
      shipping_address_collection: deliveryMethod === 'pickup' ? undefined : {
        allowed_countries: ['US', 'MX'],
      },
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      metadata: {
        clerkUserId: userId,
        deliveryMethod: deliveryMethod || 'shipping',
      },
    });

    // 3. INSERTAR EN SUPABASE USANDO EL SESSION ID DE STRIPE COMO CANDADO
    const { data: orderData, error: dbError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          clerk_user_id: userId,
          customer_email: email || '',
          amount_total: totalAmount,
          status: 'pending',
          items_json: items,
          stripe_session_id: session.id,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('SUPABASE DB ERROR:', JSON.stringify(dbError, null, 2));
      return NextResponse.json({ error: `Error en Base de Datos: ${dbError.message}` }, { status: 500 });
    }

    if (!orderData || !orderData.id) {
      return NextResponse.json({ error: 'No se pudo generar el registro de la orden' }, { status: 500 });
    }

    // Actualizamos los metadata en Stripe con el ID real de Supabase ya creado
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        clerkUserId: userId,
        supabaseOrderId: String(orderData.id),
        deliveryMethod: deliveryMethod || 'shipping',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error crítico en API Checkout:', err);
    return NextResponse.json({ error: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}