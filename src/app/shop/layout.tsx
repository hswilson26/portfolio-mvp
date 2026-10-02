import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import { ShopNav } from "@/components/shop/shop-nav";

export const metadata: Metadata = {
  title: "Closet Relay — Curated secondhand",
  description:
    "Cleaned, photographed used clothing. Send your whole closet — we price, list, and pay you after intake.",
};

export default function ShopLayout({ children }: LayoutProps<"/shop">) {
  return (
    <CartProvider>
      <div className="flex min-h-full flex-1 flex-col bg-[#f3ece0] text-[#2c2820]">
        <ShopNav />
        {children}
      </div>
    </CartProvider>
  );
}
