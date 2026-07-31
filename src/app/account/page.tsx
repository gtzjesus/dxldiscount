'use client';

import { useUser, UserButton, useClerk } from '@clerk/nextjs';
import { User, Shield, Zap, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 pb-32 pt-12 px-4 max-w-2xl mx-auto selection:bg-orange-500 selection:text-black">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-black tracking-tight uppercase italic text-orange-500">User Profile</h1>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-6">
        {isSignedIn ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <UserButton appearance={{ elements: { avatarBox: 'w-16 h-16 rounded-2xl' } }} />
              <div>
                <h2 className="text-lg font-bold text-zinc-100">{user?.fullName || 'Iron Member'}</h2>
                <p className="text-xs font-mono text-zinc-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-orange-500">
                <Zap className="w-4 h-4" /> Status: Authenticated & Connected
              </div>
              <button
                onClick={() => signOut({ redirectUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-zinc-300 mb-1">Guest Session</h2>
            <p className="text-xs text-zinc-500 font-mono mb-4 uppercase">Sign in to sync your profile and orders across devices.</p>
          </div>
        )}
      </div>
    </div>
  );
}