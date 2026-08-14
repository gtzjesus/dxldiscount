import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import ClearCartClient from '@/components/success/ClearCartClient';
import SuccessReceipt from '@/components/success/SuccessReceipt';
import SuccessActions from '@/components/success/SuccessActions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  let customerEmail = '';
  let amountTotal = 0;
  let paymentStatus = 'SUCCESS';
  let shippingDetails = null;
  let deliveryMethod = 'shipping';

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email || session.metadata?.customerEmail || '';
      amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      paymentStatus = session.payment_status?.toUpperCase() || 'SUCCESS';

      deliveryMethod = session.metadata?.deliveryMethod || 'shipping';
      const clerkUserId = session.metadata?.clerkUserId;
      const itemsJsonStr = session.metadata?.itemsJson;

      const sessionAny = session as any;
      shippingDetails = sessionAny.shipping_details || sessionAny.customer_details;

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && sessionId) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. REVISAR SI YA EXISTE UNA ORDEN CON ESTE SESSION ID (Evita duplicados si recargan la página)
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_session_id', sessionId)
          .single();

        if (!existingOrder) {
          // 2. SI NO EXISTE, LA CREAMOS AQUÍ POR PRIMERA VEZ (Solo si el pago fue real)
          let parsedItems = [];
          try {
            parsedItems = itemsJsonStr ? JSON.parse(itemsJsonStr) : [];
          } catch (e) {
            parsedItems = [];
          }

          // Definimos el estado inicial según el método de entrega
          const initialStatus = deliveryMethod === 'pickup' ? 'pending_pickup' : 'pending_shipping';

          await supabase.from('orders').insert([
            {
              user_id: clerkUserId || 'guest',
              clerk_user_id: clerkUserId || 'guest',
              customer_email: customerEmail,
              amount_total: amountTotal,
              status: initialStatus,
              items_json: parsedItems,
              stripe_session_id: sessionId,
              shipping_details: deliveryMethod === 'pickup' ? null : shippingDetails,
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error procesando la sesión de Stripe en Success:', error);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Limpia el carrito de Zustand */}
      <ClearCartClient />

      <div className="max-w-md w-full bg-slate-50 border border-slate-200/80 p-8 text-center shadow-xs">
        <SuccessReceipt
          sessionId={sessionId || ''}
          customerEmail={customerEmail}
          amountTotal={amountTotal}
          paymentStatus={paymentStatus}
          shippingDetails={shippingDetails}
          deliveryMethod={deliveryMethod}
        />
        <SuccessActions />
      </div>
    </div>
  );
}