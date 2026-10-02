import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import { ShopNav } from "@/components/shop/shop-nav";

export const metadata: Metadata = {
  title: "Closet Relay — My closet",
  description: "Track listings and payout from your closet bag.",
};

export default function ClosetLayout({ children }: LayoutProps<"/closet">) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-1 flex-col bg-[#f3ece0] text-[#2c2820]">
        <ShopNav />
        {children}
      </div>
    </CartProvider>
  );
}
