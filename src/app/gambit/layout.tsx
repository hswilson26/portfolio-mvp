import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Gambit",
  description:
    "One verified chess tactic each day. Daily Gambit ELO tracks your tactics rating; a countdown starts the clock.",
};

export default function GambitLayout({ children }: LayoutProps<"/gambit">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#143326] text-[#f3e6c9]">
      {children}
    </div>
  );
}
