"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CLOSET_STORAGE_KEY,
  demoListings,
  demoPayoutDonate,
  demoPayoutSell,
  type DemoPayout,
} from "@/data/closet-demo";

type StoredBag = {
  bagId: string;
  mode: "sell" | "donate";
  fulfillment: "ship" | "dropoff";
  email: string;
};

function formatMoney(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

function ListingThumb({ hue, title }: { hue: number; title: string }) {
  return (
    <div
      className="size-14 shrink-0 rounded-lg border border-[#ddd6c8]"
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 28% 88%), hsl(${hue} 22% 72%))`,
      }}
      aria-hidden
      title={title}
    />
  );
}

function PayoutPanel({ payout }: { payout: DemoPayout }) {
  const platformFee = payout.lineItems.find((l) =>
    l.label.toLowerCase().includes("platform"),
  );

  return (
    <div className="rounded-2xl border border-[#ddd6c8] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Payout statement</h2>
          <p className="text-sm text-[#7a7368]">
            Bag {payout.bagId} · Paid {payout.paidAt}
          </p>
        </div>
        {payout.mode === "sell" ? (
          <span className="rounded-full bg-[#eef5ea] px-2.5 py-0.5 text-xs font-medium text-[#3d523c]">
            Guaranteed at intake
          </span>
        ) : (
          <span className="rounded-full bg-[#f3ece0] px-2.5 py-0.5 text-xs font-medium text-[#5c554c]">
            Donation
          </span>
        )}
      </div>

      {payout.mode === "sell" ? (
        <>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-[#eee8dc] pb-3">
              <dt className="text-[#5c554c]">Gross estimated value</dt>
              <dd className="font-semibold">
                {formatMoney(payout.grossEstimate)}
              </dd>
            </div>
            {payout.lineItems.map((line) => (
              <div key={line.label} className="flex justify-between gap-4">
                <dt className="text-[#5c554c]">
                  {line.label}
                  {line.note ? (
                    <span className="mt-0.5 block text-xs text-[#7a7368]">
                      {line.note}
                    </span>
                  ) : null}
                </dt>
                <dd className="shrink-0 font-medium text-[#2c2820]">
                  {formatMoney(line.amount)}
                </dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-[#ddd6c8] pt-4 text-base">
              <dt className="font-semibold">Net to you</dt>
              <dd className="font-bold text-[#5c7a5a]">
                {formatMoney(payout.netPayout)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-[#faf6ef] px-3 py-2 text-xs leading-relaxed text-[#5c554c]">
            You were paid based on our estimate at processing. Items may sell
            above or below that estimate on the shop; your payout does not
            change. Platform share was {payout.platformFeePercent}% of gross
            {platformFee ? ` (${formatMoney(platformFee.amount)})` : ""}.
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-[#5c554c]">
          Thank you for donating. Processing and cleaning are covered by Closet
          Relay. You&apos;ll receive an impact summary when the bag is fully
          sorted — no cash payout.
        </p>
      )}
    </div>
  );
}

export function ClosetDashboard() {
  const [bag, setBag] = useState<StoredBag | null>(null);
  const [tab, setTab] = useState<"listings" | "payout">("listings");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLOSET_STORAGE_KEY);
      if (raw) setBag(JSON.parse(raw) as StoredBag);
    } catch {
      setBag(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="text-sm text-[#7a7368]" aria-live="polite">
        Loading…
      </p>
    );
  }

  if (!bag) {
    return (
      <div className="rounded-2xl border border-dashed border-[#c9c2b4] bg-white/70 px-6 py-14 text-center">
        <p className="text-[#5c554c]">No closet bag yet.</p>
        <Link
          href="/closet/send"
          className="mt-4 inline-block rounded-xl bg-[#5c7a5a] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Send your closet
        </Link>
        <p className="mt-4 text-xs text-[#7a7368]">
          Or load the demo: complete the send flow once to see listings and
          payout.
        </p>
      </div>
    );
  }

  const payout =
    bag.mode === "donate" ? demoPayoutDonate : demoPayoutSell;

  const statusLabel: Record<string, string> = {
    processing: "Processing",
    live: "Live on shop",
    sold: "Sold",
  };

  const statusStyle: Record<string, string> = {
    processing: "bg-amber-100 text-amber-900",
    live: "bg-[#eef5ea] text-[#3d523c]",
    sold: "bg-[#e8e4dc] text-[#4a453c]",
  };

  return (
    <div>
      <div className="rounded-2xl border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#7a7368]">Active bag</p>
        <p className="font-mono text-lg font-semibold">{bag.bagId}</p>
        <p className="mt-1 text-sm text-[#5c554c]">
          {bag.mode === "sell" ? "Sell" : "Donate"} ·{" "}
          {bag.fulfillment === "ship" ? "Shipping kit" : "Drop-off"} ·{" "}
          {bag.email}
        </p>
      </div>

      <div className="mt-6 flex gap-2 border-b border-[#ddd6c8]">
        {(["listings", "payout"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-4 py-2 text-sm font-medium capitalize ${
              tab === t
                ? "border-[#5c7a5a] text-[#2c2820]"
                : "border-transparent text-[#7a7368]"
            }`}
          >
            {t === "listings" ? "My listings" : "Payout"}
          </button>
        ))}
      </div>

      {tab === "listings" ? (
        <ul className="mt-6 space-y-3">
          {demoListings.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-[#ddd6c8] bg-white p-4"
            >
              <ListingThumb hue={item.imageHue} title={item.title} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#2c2820]">{item.title}</p>
                <p className="text-sm text-[#7a7368]">{item.brand}</p>
                <p className="text-xs text-[#7a7368]">
                  Listed automatically · List ${item.listPrice}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[item.status]}`}
              >
                {statusLabel[item.status]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <PayoutPanel payout={{ ...payout, mode: bag.mode }} />
        </div>
      )}

      <p className="mt-8 text-center text-xs text-[#7a7368]">
        Listings are managed by Closet Relay. Seller edits coming in a future
        release (demo).
      </p>
    </div>
  );
}
