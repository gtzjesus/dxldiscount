'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

export default function AccountActions() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut({ redirectUrl: '/' })}
      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all rounded-xl"
    >
      <LogOut className="w-3.5 h-3.5" /> Sign Out
    </button>
  );
}