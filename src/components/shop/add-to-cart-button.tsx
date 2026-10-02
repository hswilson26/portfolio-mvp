"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className="w-full rounded-xl bg-[#5c7a5a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4d6a4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5c7a5a]"
    >
      {added ? "Added to cart" : "Add to cart"}
    </button>
  );
}
