"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CLOSET_STORAGE_KEY,
  DEMO_BAG_ID,
  dropOffLocations,
} from "@/data/closet-demo";

type Mode = "sell" | "donate";
type Fulfillment = "ship" | "dropoff";

const steps = ["Intent", "Fulfillment", "Timeline", "Confirm"] as const;

export function SendClosetFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<Mode | null>(null);
  const [fulfillment, setFulfillment] = useState<Fulfillment | null>(null);
  const [email, setEmail] = useState("");

  function finish() {
    const payload = {
      bagId: DEMO_BAG_ID,
      mode: mode ?? "sell",
      fulfillment: fulfillment ?? "ship",
      email: email.trim() || "demo@closetrelay.app",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(CLOSET_STORAGE_KEY, JSON.stringify(payload));
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-xl">
      <ol className="mb-8 flex gap-2">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-full py-1 text-center text-xs font-medium ${
              i <= step
                ? "bg-[#5c7a5a] text-white"
                : "bg-white/80 text-[#7a7368]"
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      {step === 0 ? (
        <div className="rounded-2xl border border-[#ddd6c8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Sell or donate your closet</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5c554c]">
            Send everything in one bag. We clean, estimate market value, list
            items for you, and pay sellers after processing — regardless of
            how long pieces sit on the shop.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("sell")}
              className={`rounded-xl border p-4 text-left transition ${
                mode === "sell"
                  ? "border-[#5c7a5a] bg-[#eef5ea]"
                  : "border-[#ddd6c8] hover:border-[#c9c2b4]"
              }`}
            >
              <span className="font-semibold">Sell</span>
              <p className="mt-1 text-xs text-[#5c554c]">
                Payout after intake based on our estimate, fees shown clearly.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("donate")}
              className={`rounded-xl border p-4 text-left transition ${
                mode === "donate"
                  ? "border-[#5c7a5a] bg-[#eef5ea]"
                  : "border-[#ddd6c8] hover:border-[#c9c2b4]"
              }`}
            >
              <span className="font-semibold">Donate</span>
              <p className="mt-1 text-xs text-[#5c554c]">
                Same intake path; items resold or recycled. No payout.
              </p>
            </button>
          </div>
          <button
            type="button"
            disabled={!mode}
            onClick={() => setStep(1)}
            className="mt-6 w-full rounded-xl bg-[#5c7a5a] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="rounded-2xl border border-[#ddd6c8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">How will clothes reach us?</h2>
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => setFulfillment("ship")}
              className={`rounded-xl border p-4 text-left ${
                fulfillment === "ship"
                  ? "border-[#5c7a5a] bg-[#eef5ea]"
                  : "border-[#ddd6c8]"
              }`}
            >
              <span className="font-semibold">Ship with our kit</span>
              <p className="mt-1 text-xs text-[#5c554c]">
                We email a prepaid label and compostable bag — fill it with
                your whole closet.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFulfillment("dropoff")}
              className={`rounded-xl border p-4 text-left ${
                fulfillment === "dropoff"
                  ? "border-[#5c7a5a] bg-[#eef5ea]"
                  : "border-[#ddd6c8]"
              }`}
            >
              <span className="font-semibold">Drop off in person</span>
              <p className="mt-1 text-xs text-[#5c554c]">
                Bring bags to a Closet Relay hub — no shipping fee on payout.
              </p>
            </button>
          </div>
          {fulfillment === "dropoff" ? (
            <ul className="mt-4 space-y-2 text-sm text-[#5c554c]">
              {dropOffLocations.map((loc) => (
                <li
                  key={loc.name}
                  className="rounded-lg border border-[#eee8dc] bg-[#faf6ef] px-3 py-2"
                >
                  <p className="font-medium text-[#2c2820]">{loc.name}</p>
                  <p>{loc.address}</p>
                  <p className="text-xs text-[#7a7368]">{loc.hours}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 rounded-xl border border-[#ddd6c8] py-3 text-sm font-medium"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!fulfillment}
              onClick={() => setStep(2)}
              className="flex-1 rounded-xl bg-[#5c7a5a] py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="rounded-2xl border border-[#ddd6c8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-3 text-sm text-[#5c554c]">
            <li className="flex gap-3">
              <span className="font-semibold text-[#5c7a5a]">1.</span>
              We receive your bag and scan it in ({fulfillment === "dropoff" ? "drop-off" : "shipping"}).
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[#5c7a5a]">2.</span>
              Clean, QC, and estimate resale value for the batch.
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[#5c7a5a]">3.</span>
              {mode === "donate"
                ? "Items are listed or routed to partners; you receive an impact summary."
                : "You receive one payout — fees itemized — even if individual pieces sell later."}
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-[#5c7a5a]">4.</span>
              We photograph and list each piece automatically; track them in My closet.
            </li>
          </ol>
          <label className="mt-6 block text-sm">
            <span className="font-medium text-[#2c2820]">Email (demo)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-[#ddd6c8] bg-[#faf6ef] px-3 py-2"
            />
          </label>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-[#ddd6c8] py-3 text-sm font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={finish}
              className="flex-1 rounded-xl bg-[#5c7a5a] py-3 text-sm font-semibold text-white"
            >
              Start my bag
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-2xl border border-[#c9dfc8] bg-[#eef5ea] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#2c2820]">You&apos;re all set</h2>
          <p className="mt-2 text-sm text-[#3d523c]">
            Bag ID <span className="font-mono font-semibold">{DEMO_BAG_ID}</span>
            {mode === "sell" ? " — payout after processing." : " — donation intake."}
          </p>
          <p className="mt-4 text-sm text-[#5c554c]">
            This portfolio demo loads sample listings and a sample payout
            statement on My closet.
          </p>
          <button
            type="button"
            onClick={() => router.push("/closet")}
            className="mt-6 w-full rounded-xl bg-[#5c7a5a] py-3 text-sm font-semibold text-white"
          >
            Go to My closet
          </button>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm font-medium text-[#5c7a5a] hover:underline"
          >
            Browse the shop
          </Link>
        </div>
      ) : null}
    </div>
  );
}
