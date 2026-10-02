import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductThumb } from "@/components/shop/product-thumb";
import { getProductBySlug, shopProducts } from "@/data/shop-products";

export function generateStaticParams() {
  return shopProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: PageProps<"/shop/products/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8 lg:py-14">
      <Link
        href="/shop"
        className="text-sm font-medium text-[#5c7a5a] hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductThumb
          product={product}
          className="aspect-[4/5] w-full rounded-2xl border border-[#ddd6c8] shadow-md"
        />
        <div>
          <p className="text-sm font-medium text-[#7a7368]">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-3 text-2xl font-semibold">${product.price}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-[#ddd6c8] bg-white px-3 py-2">
              <dt className="text-[#7a7368]">Size</dt>
              <dd className="font-medium">{product.size}</dd>
            </div>
            <div className="rounded-lg border border-[#ddd6c8] bg-white px-3 py-2">
              <dt className="text-[#7a7368]">Condition</dt>
              <dd className="font-medium">{product.condition}</dd>
            </div>
            <div className="rounded-lg border border-[#ddd6c8] bg-white px-3 py-2">
              <dt className="text-[#7a7368]">Color</dt>
              <dd className="font-medium">{product.color}</dd>
            </div>
            <div className="rounded-lg border border-[#ddd6c8] bg-white px-3 py-2">
              <dt className="text-[#7a7368]">Fulfillment</dt>
              <dd className="font-medium">Ships in 2–4 days</dd>
            </div>
          </dl>

          {product.measurements ? (
            <p className="mt-4 text-sm text-[#5c554c]">
              <span className="font-medium text-[#2c2820]">Measurements: </span>
              {product.measurements}
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-[#5c554c]">
            {product.description}
          </p>

          <p className="mt-4 rounded-lg border border-[#c9dfc8] bg-[#eef5ea] px-3 py-2 text-xs leading-relaxed text-[#3d523c]">
            Listed automatically from a seller&apos;s closet bag. Closet Relay
            cleaned, photographed, and priced this item — portfolio demo.
          </p>

          <div className="mt-8 max-w-sm">
            <AddToCartButton slug={product.slug} />
          </div>
        </div>
      </div>
    </main>
  );
}
