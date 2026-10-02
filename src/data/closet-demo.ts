export type ListingStatus = "processing" | "live" | "sold";

export type DemoListing = {
  id: string;
  title: string;
  brand: string;
  listPrice: number;
  status: ListingStatus;
  imageHue: number;
};

export type PayoutLineItem = {
  label: string;
  amount: number;
  note?: string;
};

export type DemoPayout = {
  bagId: string;
  grossEstimate: number;
  platformFeePercent: number;
  lineItems: PayoutLineItem[];
  netPayout: number;
  paidAt: string;
  mode: "sell" | "donate";
};

export const DEMO_BAG_ID = "CR-2026-0842";

export const dropOffLocations = [
  {
    name: "Closet Relay — Williamsburg",
    address: "245 Bedford Ave, Brooklyn, NY",
    hours: "Mon–Sat 10am–7pm",
  },
  {
    name: "Closet Relay — Logan Square",
    address: "2200 N Milwaukee Ave, Chicago, IL",
    hours: "Wed–Sun 11am–6pm",
  },
  {
    name: "Closet Relay — Capitol Hill",
    address: "1428 E Pine St, Seattle, WA",
    hours: "Tue–Sat 10am–6pm",
  },
];

export const demoListings: DemoListing[] = [
  {
    id: "lst-1",
    title: "Linen Blend Camp Shirt",
    brand: "Everlane",
    listPrice: 38,
    status: "live",
    imageHue: 42,
  },
  {
    id: "lst-2",
    title: "High-Rise Straight Jeans",
    brand: "Madewell",
    listPrice: 52,
    status: "live",
    imageHue: 220,
  },
  {
    id: "lst-3",
    title: "Floral Midi Dress",
    brand: "Reformation",
    listPrice: 78,
    status: "sold",
    imageHue: 145,
  },
  {
    id: "lst-4",
    title: "Better Sweater 1/4 Zip",
    brand: "Patagonia",
    listPrice: 65,
    status: "live",
    imageHue: 155,
  },
  {
    id: "lst-5",
    title: "Wide Leg Trousers",
    brand: "Aritzia",
    listPrice: 44,
    status: "live",
    imageHue: 260,
  },
  {
    id: "lst-6",
    title: "Embroidered Peasant Blouse",
    brand: "Free People",
    listPrice: 36,
    status: "processing",
    imageHue: 48,
  },
  {
    id: "lst-7",
    title: "Trucker Jacket",
    brand: "Levi's",
    listPrice: 58,
    status: "live",
    imageHue: 205,
  },
  {
    id: "lst-8",
    title: "Tiered Cotton Mini",
    brand: "Cotton On",
    listPrice: 22,
    status: "processing",
    imageHue: 18,
  },
];

export const demoPayoutSell: DemoPayout = {
  bagId: DEMO_BAG_ID,
  grossEstimate: 420,
  platformFeePercent: 40,
  lineItems: [
    {
      label: "Platform share (40% of estimate)",
      amount: -168,
      note: "Covers listing, marketing, and fulfillment margin",
    },
    { label: "Cleaning & processing", amount: -12 },
    { label: "Inbound shipping", amount: -8 },
    { label: "Packaging & photography", amount: -6 },
  ],
  netPayout: 226,
  paidAt: "2026-03-18",
  mode: "sell",
};

export const demoPayoutDonate: DemoPayout = {
  bagId: DEMO_BAG_ID,
  grossEstimate: 0,
  platformFeePercent: 0,
  lineItems: [
    { label: "Processing & cleaning", amount: 0, note: "Covered by Closet Relay for donations" },
  ],
  netPayout: 0,
  paidAt: "2026-03-18",
  mode: "donate",
};

export const CLOSET_STORAGE_KEY = "closet-relay-demo-bag";
