import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;

  let customerEmail = '';
  let amountTotal = 0;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email || '';
      amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    } catch (error) {
      console.error('Error al recuperar la sesión de Stripe:', error);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-50 border border-slate-200/80 p-8 text-center shadow-xs">
        
        {/* Icono de éxito */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-black tracking-tight mb-2">
          ¡Pago Exitoso!
        </h1>
        <p className="text-xs text-slate-600 mb-6">
          Muchas gracias por tu compra. Tu orden ha sido procesada correctamente a través de Stripe.
        </p>

        {/* Resumen rápido de la compra si hay datos */}
        {sessionId && (
          <div className="bg-white border border-slate-200 p-4 mb-6 text-left space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Estado:</span>
              <span className="text-emerald-600 font-bold">PAGADO / TEST</span>
            </div>
            {customerEmail && (
              <div className="flex justify-between">
                <span className="text-slate-500">Correo:</span>
                <span className="text-slate-800">{customerEmail}</span>
              </div>
            )}
            {amountTotal > 0 && (
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                <span className="text-slate-500 font-bold">Total:</span>
                <span className="text-slate-900 font-bold">${amountTotal.toFixed(2)} USD</span>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider transition-all hover:bg-slate-800"
          >
            <ShoppingBag className="w-4 h-4" /> Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}