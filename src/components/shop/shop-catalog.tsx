"use client";

import { useMemo, useState } from "react";
import { shopProducts, shopCategories } from "@/data/shop-products";
import { ProductCard } from "./product-card";

export function ShopCatalog() {
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    if (category === "all") return shopProducts;
    return shopProducts.filter((p) => p.category === category);
  }, [category]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {shopCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              category === cat.id
                ? "border-[#5c7a5a] bg-[#5c7a5a] text-white"
                : "border-[#ddd6c8] bg-white text-[#4a453c] hover:border-[#c9c2b4]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
