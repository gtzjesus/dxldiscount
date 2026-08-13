import { Package, Clock, Store, Truck } from 'lucide-react';

interface OrderCardProps {
  order: {
    id: string;
    created_at: string;
    status: string;
    amount_total: number;
    items_json: any[];
    shipping_details?: any;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const isPaid = order.status === 'paid' || order.status === 'completed';
  // Si no hay shipping_details, asumimos que fue Local Pickup
  const isPickup = !order.shipping_details;

  return (
    <div className="bg-slate-50 border border-slate-200/80 p-6 text-left shadow-xs transition-all hover:border-slate-300">
      {/* Header de la orden */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>ID: {order.id.slice(0, 12)}...</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{new Date(order.created_at).toLocaleDateString()} — {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Badge de Estatus */}
        <span className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase border ${
          isPaid 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          {order.status}
        </span>
      </div>

      {/* Lista de Productos */}
      <div className="bg-white border border-slate-200 p-3 mb-4 space-y-2 font-mono text-xs shadow-2xs">
        <span className="text-slate-400 block uppercase font-bold text-[10px] pb-1 border-b border-slate-100">
          Items Ordered:
        </span>
        
        {order.items_json?.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center text-slate-700 pt-1">
            <span className="truncate max-w-[240px]">
              <strong className="text-slate-900">{item.quantity}x</strong> {item.name}
            </span>
            <span className="font-bold text-slate-900">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-2">
          <span className="text-slate-900 font-bold uppercase">Total Paid:</span>
          <span className="text-slate-900 font-black text-sm">${order.amount_total?.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Fulfillment Section: Pickup vs Shipping */}
      <div className="text-[11px] font-mono text-slate-600 border-t border-slate-200/60 pt-3">
        {isPickup ? (
          <div className="bg-amber-50/50 p-2 border border-amber-100">
            <span className="text-amber-800 flex items-center gap-1.5 uppercase font-bold text-[10px] mb-1">
              <Store className="w-3 h-3" /> Local Pickup
            </span>
            <p className="font-bold text-slate-900">Warehouse Location</p>
            <p>Av. Principal #123, Zona Industrial</p>
            <p>Open M-F, 10am-2pm </p>
            
          </div>
        ) : (
          <div>
            <span className="text-slate-400 flex items-center gap-1.5 uppercase font-bold text-[10px] mb-1">
              <Truck className="w-3 h-3" /> Shipping Address:
            </span>
            {order.shipping_details.name && <p className="font-bold text-slate-900">{order.shipping_details.name}</p>}
            {order.shipping_details.address?.line1 && <p>{order.shipping_details.address.line1}</p>}
            <p>
              {[
                order.shipping_details.address?.city, 
                order.shipping_details.address?.state, 
                order.shipping_details.address?.postal_code
              ].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}