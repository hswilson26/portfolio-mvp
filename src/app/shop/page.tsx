import Link from "next/link";
import { ShopCatalog } from "@/components/shop/shop-catalog";

export default function ShopPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-8 lg:py-16">
      <section className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-[#5c7a5a]">
          Circular fashion
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2c2820] sm:text-4xl text-balance">
          Curated secondhand, cleaned and ready to wear
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#5c554c] text-pretty">
          Every piece is inspected, washed or dry-cleaned, and listed by Closet
          Relay. Want the other side?{" "}
          <Link
            href="/closet/send"
            className="font-semibold text-[#5c7a5a] underline-offset-2 hover:underline"
          >
            Send your whole closet
          </Link>{" "}
          and get paid after we process your bag — no item-by-item listing.
        </p>
      </section>

      <section className="mt-12" aria-label="Product catalog">
        <ShopCatalog />
      </section>
    </main>
  );
}
