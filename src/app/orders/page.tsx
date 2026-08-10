import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import OrderCard from '@/components/orders/OrderCard';
import { ShoppingBag } from 'lucide-react';

export default async function UserOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <p className="font-mono text-xs text-slate-600 mb-4">Please sign in to view your orders.</p>
        <Link href="/" className="bg-black text-white text-xs font-mono uppercase tracking-widest px-6 py-3">
          Return Home
        </Link>
      </div>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl!, supabaseKey!);

  // Consultamos las órdenes de este usuario en Supabase
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('clerk_user_id', userId)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center px-4 py-16">
      <div className="max-w-xl w-full">
        {/* Header estilo Receipt */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-full">
              <ShoppingBag className="w-6 h-6 text-slate-900" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">
            Order History
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Track your past purchases and fulfillment status.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 text-center font-mono text-xs text-red-600 mb-6">
            Error loading your orders. Please try again later.
          </div>
        )}

        {(!orders || orders.length === 0) ? (
          <div className="bg-slate-50 border border-slate-200/80 p-8 text-center space-y-4">
            <p className="text-xs font-mono text-slate-600">You haven't placed any orders yet.</p>
            <div>
              <Link 
                href="/" 
                className="inline-block bg-black text-white text-xs font-mono uppercase tracking-widest px-6 py-3 transition-opacity hover:opacity-80"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}