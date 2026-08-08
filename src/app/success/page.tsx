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

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email || '';
      amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      paymentStatus = session.payment_status?.toUpperCase() || 'SUCCESS';

      const orderId = session.metadata?.supabaseOrderId;
      const sessionAny = session as any;
      const shippingDetails = sessionAny.shipping_details || sessionAny.customer_details;

      if (orderId) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);

          await supabase
            .from('orders')
            .update({
              status: 'paid',
              shipping_details: shippingDetails,
              stripe_session_id: sessionId,
            })
            .eq('id', orderId);
        }
      }
    } catch (error) {
      console.error('Error retrieving Stripe session or updating DB:', error);
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
        />
        <SuccessActions />
      </div>
    </div>
  );
}