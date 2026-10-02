import type { ShopProduct } from "@/data/shop-products";

type ProductThumbProps = {
  product: Pick<ShopProduct, "title" | "brand" | "imageHue">;
  className?: string;
};

export function ProductThumb({ product, className = "" }: ProductThumbProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(145deg, hsl(${product.imageHue} 28% 88%), hsl(${product.imageHue} 22% 72%))`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
      <div className="absolute bottom-3 left-3 right-3 rounded-md bg-white/75 px-2 py-1 text-[10px] font-medium tracking-wide text-[#4a453c] backdrop-blur-sm">
        {product.brand}
      </div>
    </div>
  );
}
