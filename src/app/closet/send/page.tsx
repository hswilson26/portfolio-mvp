import { SendClosetFlow } from "@/components/closet/send-closet-flow";

export default function SendClosetPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-8 lg:py-14">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Send your closet
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#5c554c]">
        One bag, whole wardrobe. Portfolio demo — no real labels or payments.
      </p>
      <div className="mt-10">
        <SendClosetFlow />
      </div>
    </main>
  );
}
