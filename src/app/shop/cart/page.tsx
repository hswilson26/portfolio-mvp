"use client";

import Link from "next/link";
import { ProductThumb } from "@/components/shop/product-thumb";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { resolvedLines, subtotal, setQuantity, removeItem, clearCart } =
    useCart();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8 lg:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your cart</h1>

      {resolvedLines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#c9c2b4] bg-white/60 px-6 py-14 text-center">
          <p className="text-[#5c554c]">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-semibold text-[#5c7a5a] hover:underline"
          >
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {resolvedLines.map(({ product, quantity, lineTotal }) => (
              <li
                key={product.slug}
                className="flex gap-4 rounded-2xl border border-[#ddd6c8] bg-white p-4 shadow-sm"
              >
                <ProductThumb
                  product={product}
                  className="size-24 shrink-0 rounded-xl"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/shop/products/${product.slug}`}
                    className="font-semibold text-[#2c2820] hover:text-[#5c7a5a]"
                  >
                    {product.title}
                  </Link>
                  <p className="text-sm text-[#7a7368]">
                    {product.brand} · Size {product.size}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-[#7a7368]">Qty</span>
                      <select
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(product.slug, Number(e.target.value))
                        }
                        className="rounded-lg border border-[#ddd6c8] bg-[#faf6ef] px-2 py-1"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(product.slug)}
                      className="text-sm text-[#7a7368] underline-offset-2 hover:text-[#2c2820] hover:underline"
                    >
                      Remove
                    </button>
                    <span className="ml-auto font-semibold">${lineTotal}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-[#ddd6c8] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-[#5c554c]">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-xs text-[#7a7368]">
              Shipping calculated at checkout (demo).
            </p>
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-xl border border-[#ddd6c8] bg-[#f3ece0] px-4 py-3 text-sm font-semibold text-[#7a7368]"
            >
              Checkout — portfolio demo
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs text-[#7a7368] hover:text-[#2c2820]"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
