import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import ClearCartClient from './ClearCartClient'; // <--- Importamos el limpiador de carrito

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
      {/* Componente de cliente que limpia el carrito de Zustand / localStorage */}
      <ClearCartClient />

      <div className="max-w-md w-full bg-slate-50 border border-slate-200/80 p-8 text-center shadow-xs">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 flex items-center justify-center rounded-full">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight mb-2 uppercase">
          Payment Successful!
        </h1>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Thank you for your purchase. <br /> Your order has been securely processed and confirmed.
        </p>

        {/* Order Details Receipt Box */}
        {sessionId && (
          <div className="bg-white border border-slate-200 p-4 mb-6 text-left space-y-2.5 font-mono text-xs shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-100">
                {paymentStatus}
              </span>
            </div>
            {customerEmail && (
              <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                <span className="text-slate-400">Billed To:</span>
                <span className="text-slate-800 truncate max-w-[200px]" title={customerEmail}>
                  {customerEmail}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-slate-100 pt-2">
              <span className="text-slate-400">Reference ID:</span>
              <span className="text-slate-700 truncate max-w-[180px]" title={sessionId}>
                {sessionId.slice(0, 16)}...
              </span>
            </div>
            {amountTotal > 0 && (
              <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-1">
                <span className="text-slate-900 font-bold uppercase">Total Paid:</span>
                <span className="text-slate-900 font-black text-sm">${amountTotal.toFixed(2)} USD</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-800 active:scale-[0.99] shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          
          <Link
            href="/orders"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-50 active:scale-[0.99]"
          >
            <Package className="w-4 h-4 text-slate-600" /> View Orders <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}