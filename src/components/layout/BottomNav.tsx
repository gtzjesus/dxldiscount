'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ShoppingCart, Package, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Shop', href: '/', icon: ShoppingBag },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Account', href: '/account', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[100%] max-auto">
      <div className="flex items-center justify-around bg-[#121212]/95 backdrop-blur-xl border-t border-zinc-800 p-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCart = item.href === '/cart';

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative p-2 group flex flex-col items-center justify-center min-w-[64px]"
            >
              {/* Vibrant orange glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 blur-md rounded-xl pointer-events-none bg-orange-500/15" />
              )}

              {/* Element Container */}
              <div className="relative flex flex-col items-center z-10">
                <div className="relative">
                  <item.icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  />
                  
                  {/* Cart Item Badge */}
                  {isCart && mounted && totalItems > 0 && (
                    <span className="absolute -top-2 -right-3 bg-orange-500 text-black font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[8px] mt-1 font-mono uppercase tracking-widest transition-colors duration-200 ${
                    isActive ? 'text-orange-500 font-bold' : 'text-zinc-500'
                  }`}
                >
                  {item.name}
                </span>

                {/* Active Indicator Dot/Line */}
                {isActive && (
                  <div className="h-[2px] w-3 mt-0.5 rounded-full bg-orange-500" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}