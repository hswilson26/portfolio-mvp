export type ProductCondition = "Like New" | "Excellent" | "Good" | "Fair";

export type ShopProduct = {
  slug: string;
  title: string;
  brand: string;
  category: "tops" | "bottoms" | "dresses" | "outerwear" | "accessories";
  size: string;
  price: number;
  condition: ProductCondition;
  color: string;
  description: string;
  measurements?: string;
  imageHue: number;
};

export const shopProducts: ShopProduct[] = [
  {
    slug: "everlane-linen-blend-shirt",
    title: "Linen Blend Camp Shirt",
    brand: "Everlane",
    category: "tops",
    size: "M",
    price: 38,
    condition: "Excellent",
    color: "Oat",
    description:
      "Lightweight camp collar shirt. Washed and steamed by Closet Relay. Small thread pull near hem (not visible when tucked).",
    measurements: "Chest 40\" · Length 28\"",
    imageHue: 42,
  },
  {
    slug: "madewell-high-rise-jeans",
    title: "High-Rise Straight Jeans",
    brand: "Madewell",
    category: "bottoms",
    size: "28",
    price: 52,
    condition: "Good",
    color: "Indigo",
    description:
      "Classic straight leg with gentle fade. Professionally cleaned; minor whiskering at pockets.",
    measurements: "Waist 28\" · Inseam 30\"",
    imageHue: 220,
  },
  {
    slug: "reformation-midi-dress",
    title: "Floral Midi Dress",
    brand: "Reformation",
    category: "dresses",
    size: "S",
    price: 78,
    condition: "Like New",
    color: "Sage floral",
    description:
      "Bias-cut midi with adjustable straps. Worn once per seller note; no stains or snags after our QC pass.",
    measurements: "Bust 34\" · Length 46\"",
    imageHue: 145,
  },
  {
    slug: "patagonia-fleece-1-4",
    title: "Better Sweater 1/4 Zip",
    brand: "Patagonia",
    category: "outerwear",
    size: "L",
    price: 65,
    condition: "Excellent",
    color: "Forest",
    description:
      "Cozy quarter zip, pilling removed. Zipper runs smooth; label shows light wear.",
    imageHue: 155,
  },
  {
    slug: "cos-wool-coat",
    title: "Wool Blend Long Coat",
    brand: "COS",
    category: "outerwear",
    size: "M",
    price: 120,
    condition: "Excellent",
    color: "Camel",
    description:
      "Minimal single-breasted coat. Lined, dry-cleaned in-house. One button replaced with matching thread.",
    measurements: "Shoulder 17\" · Length 42\"",
    imageHue: 32,
  },
  {
    slug: "uniqlo-merino-crew",
    title: "Extra Fine Merino Crew",
    brand: "Uniqlo",
    category: "tops",
    size: "S",
    price: 28,
    condition: "Good",
    color: "Heather grey",
    description: "Soft merino layer. Light pilling under arms; priced accordingly.",
    imageHue: 210,
  },
  {
    slug: "levis-trucker-jacket",
    title: "Trucker Jacket",
    brand: "Levi's",
    category: "outerwear",
    size: "M",
    price: 58,
    condition: "Good",
    color: "Medium wash",
    description:
      "Broken-in denim jacket with authentic fade. Hardware polished; interior label faded.",
    imageHue: 205,
  },
  {
    slug: "aritzia-wide-leg-trousers",
    title: "Wide Leg Trousers",
    brand: "Aritzia",
    category: "bottoms",
    size: "6",
    price: 44,
    condition: "Like New",
    color: "Black",
    description: "Tailored wide leg with pressed crease. No hem wear.",
    measurements: "Waist 27\" · Inseam 31\"",
    imageHue: 260,
  },
  {
    slug: "free-people-embroidered-blouse",
    title: "Embroidered Peasant Blouse",
    brand: "Free People",
    category: "tops",
    size: "M",
    price: 36,
    condition: "Excellent",
    color: "Ivory",
    description: "Cotton voile with chest embroidery. Elastic cuffs refreshed.",
    imageHue: 48,
  },
  {
    slug: "nike-air-max-sneakers",
    title: "Air Max 90",
    brand: "Nike",
    category: "accessories",
    size: "9",
    price: 72,
    condition: "Good",
    color: "White / grey",
    description:
      "Sneakers sanitized and re-laced. Outsole wear consistent with casual use; insoles replaced.",
    imageHue: 0,
  },
  {
    slug: "cotton-on-summer-dress",
    title: "Tiered Cotton Mini",
    brand: "Cotton On",
    category: "dresses",
    size: "M",
    price: 22,
    condition: "Good",
    color: "Rust",
    description: "Easy summer dress with pockets. Minor fade from sun, even tone.",
    imageHue: 18,
  },
  {
    slug: "everlane-day-market-tote",
    title: "Day Market Tote",
    brand: "Everlane",
    category: "accessories",
    size: "One size",
    price: 34,
    condition: "Fair",
    color: "Tan",
    description:
      "Structured leather tote. Handles conditioned; interior pen mark covered with matching liner patch.",
    imageHue: 35,
  },
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return shopProducts.find((p) => p.slug === slug);
}

export const shopCategories = [
  { id: "all", label: "All" },
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "dresses", label: "Dresses" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
] as const;
