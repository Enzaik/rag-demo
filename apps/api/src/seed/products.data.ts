// Seed catalog for the fictional "Alpine Forge" outdoor gear company.
// Kept in code (not JSON) so it's type-checked against the drizzle schema.

export interface ProductSeed {
  name: string;
  description: string;
  specs: Record<string, unknown>;
  priceCents: number;
}

export const productsSeed: ProductSeed[] = [
  {
    name: "Ridge Runner 35L Backpack",
    description:
      "A 35-liter top-loading daypack for fast-and-light alpine missions. Roll-top closure, compression straps, and a dedicated ice-axe loop.",
    specs: { volume_liters: 35, weight_grams: 820, material: "210D ripstop nylon", color: ["slate", "clay"] },
    priceCents: 18900,
  },
  {
    name: "Summit Shell Jacket",
    description:
      "A three-layer waterproof hardshell with fully taped seams and a helmet-compatible hood. Built for long days in driving rain and wet snow.",
    specs: { waterproof_rating_mm: 28000, weight_grams: 410, membrane: "3L nylon", sizes: ["XS", "S", "M", "L", "XL"] },
    priceCents: 42900,
  },
  {
    name: "Ember Down Hoodie 800FP",
    description:
      "An 800-fill-power down insulation layer with an ethically sourced down blend. Packs into its own pocket for shoulder-season travel.",
    specs: { fill_power: 800, fill_weight_grams: 120, shell: "10D ripstop nylon", sizes: ["XS", "S", "M", "L", "XL"] },
    priceCents: 32900,
  },
  {
    name: "Trailblazer Hiking Pants",
    description:
      "A stretch-woven four-season hiking pant with articulated knees, DWR finish, and zippered thigh pockets.",
    specs: { material: "nylon/elastane 92/8", weight_grams: 340, inseam_cm: [76, 81, 86], sizes: ["28", "30", "32", "34", "36"] },
    priceCents: 11900,
  },
  {
    name: "Cirrus Ultralight Tent 2P",
    description:
      "A freestanding two-person double-wall tent weighing under 1.2 kg. DAC poles, two doors, two vestibules.",
    specs: { capacity: 2, weight_grams: 1180, poles: "DAC Featherlite NSL", season: "3-season" },
    priceCents: 49900,
  },
  {
    name: "Cascade 20°F Sleeping Bag",
    description:
      "A mummy-cut 20°F down bag filled with hydrophobic 850-fill down. Anatomical hood, draft collar, and a YKK locking zipper.",
    specs: { temp_rating_f: 20, fill: "850FP hydrophobic down", weight_grams: 910, sizes: ["regular", "long"] },
    priceCents: 38900,
  },
  {
    name: "Pinnacle Trail Runner",
    description:
      "A lightweight trail-running shoe with a 6mm drop, sticky rubber outsole, and a rock plate for rugged terrain.",
    specs: { drop_mm: 6, stack_mm: 28, weight_grams: 280, sizes_us: [7, 8, 9, 10, 11, 12, 13] },
    priceCents: 15900,
  },
  {
    name: "Glacier Merino Base Layer",
    description:
      "A 200gsm merino wool long-sleeve crew. Odor-resistant, soft next to skin, and warm even when damp.",
    specs: { fabric_gsm: 200, material: "100% merino wool", sizes: ["XS", "S", "M", "L", "XL"] },
    priceCents: 8900,
  },
  {
    name: "Torrent Rain Pants",
    description:
      "Packable 2.5-layer rain pants with full-length side zips for quick on/off over boots and crampons.",
    specs: { waterproof_rating_mm: 20000, weight_grams: 290, side_zip: "full length", sizes: ["XS", "S", "M", "L", "XL"] },
    priceCents: 19900,
  },
  {
    name: "Helios Solar Lantern",
    description:
      "A collapsible USB-rechargeable camp lantern with a built-in solar panel. 150 lumens on high, up to 24 hours on low.",
    specs: { lumens_max: 150, battery_mah: 2000, weight_grams: 130, solar: true },
    priceCents: 5900,
  },
  {
    name: "Basecamp Dome Tent 4P",
    description:
      "A roomy four-person dome tent for car camping. Color-coded poles, large D-door, and a 120-inch peak height.",
    specs: { capacity: 4, weight_grams: 4200, peak_height_cm: 305, season: "3-season" },
    priceCents: 34900,
  },
  {
    name: "Quickdraw Trekking Poles",
    description:
      "A pair of aluminum trekking poles with flick-lock adjustment, cork grips, and interchangeable carbide tips.",
    specs: { material: "7075 aluminum", weight_pair_grams: 480, length_range_cm: [110, 140] },
    priceCents: 7900,
  },
  {
    name: "Headwall Climbing Helmet",
    description:
      "A hybrid foam/ABS helmet certified for climbing, ski touring, and mountaineering. 320g and dial-adjustable.",
    specs: { weight_grams: 320, certification: "EN 12492, UIAA 106", sizes: ["S/M", "L/XL"] },
    priceCents: 9900,
  },
  {
    name: "Wayfinder Compass",
    description:
      "A baseplate orienteering compass with a declination adjustment, luminous markings, and a magnifier.",
    specs: { declination_adjustable: true, weight_grams: 40, luminous: true },
    priceCents: 3900,
  },
  {
    name: "Forge Stainless Water Bottle 750mL",
    description:
      "A double-walled vacuum-insulated stainless bottle. Keeps drinks cold for 24 hours and hot for 12.",
    specs: { volume_ml: 750, insulated: true, weight_grams: 360, material: "18/8 stainless" },
    priceCents: 3200,
  },
  {
    name: "Tundra Insulated Mittens",
    description:
      "PrimaLoft Gold-insulated mittens with a goatskin palm and removable wool liners for sub-zero days.",
    specs: { insulation: "PrimaLoft Gold 200g", palm: "goatskin leather", sizes: ["S", "M", "L", "XL"] },
    priceCents: 11900,
  },
  {
    name: "Sawtooth Multitool",
    description:
      "A 14-function stainless multitool with locking pliers, wire cutters, and a serrated blade.",
    specs: { functions: 14, weight_grams: 230, material: "420 stainless steel" },
    priceCents: 8900,
  },
  {
    name: "Vista 8x42 Binoculars",
    description:
      "Compact roof-prism binoculars with BaK-4 prisms, fully multi-coated optics, and a waterproof nitrogen-purged body.",
    specs: { magnification: 8, objective_mm: 42, waterproof: true, weight_grams: 620 },
    priceCents: 16900,
  },
  {
    name: "Campfire Cast Iron Skillet 10in",
    description:
      "A pre-seasoned 10-inch cast iron skillet with a helper handle. Oven-, grill-, and open-fire-safe.",
    specs: { diameter_in: 10, weight_grams: 2100, pre_seasoned: true },
    priceCents: 4900,
  },
  {
    name: "Zephyr Cycling Windbreaker",
    description:
      "A 60-gram packable wind shell with a high collar, drop tail, and three rear pockets for cycling.",
    specs: { weight_grams: 62, material: "15D ripstop nylon", packable: true, sizes: ["XS", "S", "M", "L", "XL"] },
    priceCents: 9900,
  },
];
