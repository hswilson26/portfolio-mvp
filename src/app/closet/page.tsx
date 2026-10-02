import { ClosetDashboard } from "@/components/closet/closet-dashboard";

export default function ClosetPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8 lg:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        My closet
      </h1>
      <p className="mt-2 text-sm text-[#5c554c]">
        Items we listed from your bag. Payout is based on intake processing,
        not per-item sales.
      </p>
      <div className="mt-8">
        <ClosetDashboard />
      </div>
    </main>
  );
}
