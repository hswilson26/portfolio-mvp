"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export function ShopNav() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-[#d4cfc4]/80 bg-[#faf6ef]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link
          href="/shop"
          className="text-lg font-semibold tracking-tight text-[#2c2820] hover:text-[#5c7a5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c7a5a]"
        >
          Closet Relay
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-[#4a453c]">
          <Link href="/shop" className="hover:text-[#2c2820]">
            Shop
          </Link>
          <Link href="/closet/send" className="hover:text-[#2c2820]">
            Send your closet
          </Link>
          <Link href="/closet" className="hover:text-[#2c2820]">
            My closet
          </Link>
          <Link
            href="/shop/cart"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#c9c2b4] bg-white px-3 py-1 text-[#2c2820] shadow-sm hover:border-[#5c7a5a]/40"
          >
            Cart
            {itemCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#5c7a5a] text-xs font-semibold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/"
            className="text-[#7a7368] hover:text-[#2c2820]"
          >
            Portfolio
          </Link>
        </nav>
      </div>
    </header>
  );
}
