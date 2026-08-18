'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';
import AccountActions from '@/components/account/AccountActions';

export default function AccountPage() {
  const { isSignedIn, user } = useUser();

  // Función limpia para iniciar sesión desde Account sin disparar el checkout del carrito
  const handleSignInClick = () => {
    // Nos aseguramos de borrar cualquier bandera pendiente de checkout anterior
    sessionStorage.removeItem('pending_checkout');
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 pb-32 pt-12 px-4 max-w-2xl mx-auto selection:bg-orange-500 selection:text-white">
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight uppercase italic text-slate-900">
          User Profile
        </h1>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 p-6 shadow-xs">
        {isSignedIn ? (
          <div className="space-y-6">
            {/* Cabecera del Usuario */}
            <div className="flex items-center gap-4">
              <UserButton appearance={{ elements: { avatarBox: 'w-16 h-16 rounded-xl border border-slate-200 shadow-xs' } }} />
              <div>
                <h2 className="text-base font-bold text-slate-900">{user?.fullName || 'Member'}</h2>
                <p className="text-xs font-mono text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Status Badge Limpio y Moderno */}
            <div className="bg-emerald-50 border border-emerald-200 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wide">
                  Account Active
                </span>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Acciones de Cuenta (Diseño ordenado hacia abajo o distribuido) */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Session Management
                </span>
                <AccountActions />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Hello User</h2>
            <p className="text-xs text-slate-500 font-mono mb-6">
              Sign in to see your profile/orders across devices.
            </p>

            {/* Al hacer clic limpiamos la bandera de pending_checkout y redirigimos de vuelta a /account */}
            <div onClick={handleSignInClick}>
              <SignInButton mode="modal" forceRedirectUrl="/account">
                <button
                  type="button"
                  className="w-full py-4 bg-slate-900 text-white font-bold text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] hover:bg-slate-800 uppercase"
                >
                  Sign In / Register
                </button>
              </SignInButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}