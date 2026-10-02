import Link from "next/link";
import type { ShopProduct } from "@/data/shop-products";
import { ProductThumb } from "./product-thumb";

export function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#ddd6c8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/shop/products/${product.slug}`} className="block">
        <ProductThumb product={product} className="aspect-[4/5] w-full" />
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-[#7a7368]">
            {product.condition} · Size {product.size}
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#2c2820] group-hover:text-[#5c7a5a]">
            {product.title}
          </h2>
          <p className="mt-2 text-sm font-semibold text-[#2c2820]">
            ${product.price}
          </p>
        </div>
      </Link>
    </article>
  );
}
