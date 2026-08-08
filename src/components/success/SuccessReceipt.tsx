import { CheckCircle2 } from 'lucide-react';

interface SuccessReceiptProps {
  sessionId: string;
  customerEmail: string;
  amountTotal: number;
  paymentStatus: string;
  shippingDetails?: any;
}

export default function SuccessReceipt({
  sessionId,
  customerEmail,
  amountTotal,
  paymentStatus,
  shippingDetails,
}: SuccessReceiptProps) {
  return (
    <>
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

          {/* Shipping Address Section */}
          {shippingDetails && (
            <div className="border-t border-slate-200 pt-3 mt-2">
              <span className="text-slate-400 block mb-1 uppercase font-bold text-[10px]"></span>
              <div className="text-slate-700 space-y-0.5">
                {shippingDetails.name && <p className="font-bold text-slate-900">{shippingDetails.name}</p>}
                {shippingDetails.address?.line1 && <p>{shippingDetails.address.line1}</p>}
                {shippingDetails.address?.line2 && <p>{shippingDetails.address.line2}</p>}
                <p>
                  {[shippingDetails.address?.city, shippingDetails.address?.state, shippingDetails.address?.postal_code]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {shippingDetails.address?.country && <p className="uppercase">{shippingDetails.address.country}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}