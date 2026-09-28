import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Gambit",
  description:
    "One verified chess tactic each day. Calendar archive, hearts, and a live clock that never resets on retry.",
};

export default function GambitLayout({ children }: LayoutProps<"/gambit">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#143326] text-[#f3e6c9]">
      {children}
    </div>
  );
}
