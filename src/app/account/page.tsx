'use client';

import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Shield, Zap } from 'lucide-react';
import AccountActions from '@/components/account/AccountActions';

export default function AccountPage() {
  const { isSignedIn, user } = useUser();

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
            <div className="flex items-center gap-4">
              <UserButton appearance={{ elements: { avatarBox: 'w-16 h-16 rounded-xl border border-slate-200' } }} />
              <div>
                <h2 className="text-base font-bold text-slate-900">{user?.fullName || 'Member'}</h2>
                <p className="text-xs font-mono text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100">
                <Zap className="w-3.5 h-3.5" /> Status: Authenticated & Connected
              </div>
              <AccountActions />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Hello User</h2>
            <p className="text-xs text-slate-500 font-mono mb-4 ">
              Sign in to see your profile/orders across devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}