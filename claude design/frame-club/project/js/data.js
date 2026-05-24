// data.js — Frame Club product + customization data
const FC_PRODUCTS = [
  {
    id: "p1", slug: "porsche-carrera-gt",
    name: "Carrera GT", brand: "Porsche",
    description: "2004 mid-engine flagship. The last analogue supercar from Stuttgart. 5.7L V10 derived from a stillborn F1 program, six-speed manual, carbon-fibre monocoque. Built to a brief no committee would now approve.",
    price: 5000, status: "available", years: "2003–2007",
    deliveryDays: 7, edition: "003 / 050", sku: "FC-04",
    specs: { power: "612 PS", torque: "590 Nm", topSpeed: "330 KM/H", zeroSixty: "3.8 S", year: "2004" },
    image: "assets/cars/car-1.webp",
  },
  {
    id: "p2", slug: "porsche-911-gt2-rs",
    name: "911 GT2 RS", brand: "Porsche",
    description: "Weissach package. 3.8L flat-six twin-turbo. Rear-wheel terror with the Nürburgring lap record in its pocket.",
    price: 5000, status: "preorder", years: "2017–2019",
    deliveryDays: 10, edition: "012 / 050", sku: "FC-08",
    specs: { power: "700 PS", torque: "750 Nm", topSpeed: "340 KM/H", zeroSixty: "2.8 S", year: "2018" },
    image: "assets/cars/car-2.webp",
  },
  {
    id: "p3", slug: "nissan-skyline-r34",
    name: "Skyline GT-R", brand: "Nissan",
    description: "R34. Bayside Blue. RB26DETT. JDM royalty — the moment the Skyline became scripture.",
    price: 5000, status: "available", years: "1999–2002",
    deliveryDays: 7, edition: "021 / 050", sku: "FC-11",
    specs: { power: "280 PS", torque: "392 Nm", topSpeed: "265 KM/H", zeroSixty: "4.9 S", year: "1999" },
    image: "assets/cars/car-3.webp",
  },
  {
    id: "p4", slug: "toyota-supra-mk4",
    name: "Supra MK4", brand: "Toyota",
    description: "2JZ-GTE. Twin sequential turbos. Targa top. The engine that refused to die.",
    price: 5000, status: "available", years: "1993–2002",
    deliveryDays: 7, edition: "008 / 050", sku: "FC-02",
    specs: { power: "326 PS", torque: "451 Nm", topSpeed: "250 KM/H", zeroSixty: "4.6 S", year: "1997" },
    image: "assets/cars/framediecast.webp",
  },
  {
    id: "p5", slug: "lamborghini-countach",
    name: "Countach", brand: "Lamborghini",
    description: "Wedge geometry. Scissor doors. The poster on every bedroom wall, made permanent.",
    price: 5000, status: "unavailable", years: "1974–1990",
    deliveryDays: 14, edition: "—", sku: "FC-14",
    specs: { power: "455 PS", torque: "500 Nm", topSpeed: "295 KM/H", zeroSixty: "4.9 S", year: "1988" },
    image: "assets/cars/car-1.webp",
  },
  {
    id: "p6", slug: "ferrari-f40",
    name: "F40", brand: "Ferrari",
    description: "The last Enzo. Twin-turbo V8. No frills. No traction control. No apology.",
    price: 5000, status: "preorder", years: "1987–1992",
    deliveryDays: 10, edition: "017 / 050", sku: "FC-06",
    specs: { power: "478 PS", torque: "577 Nm", topSpeed: "324 KM/H", zeroSixty: "4.1 S", year: "1989" },
    image: "assets/cars/car-2.webp",
  },
];

const FC_BACKGROUNDS = [
  { value: "carbon", label: "Carbon Grid", desc: "45° hairline weave on charcoal" },
  { value: "race",   label: "Race Line",  desc: "Diagonal speed indicator" },
  { value: "atlas",  label: "Atlas",      desc: "Cartographic grid pattern" },
  { value: "monolith", label: "Monolith", desc: "Solid charcoal — pure form" },
  { value: "heritage", label: "Heritage", desc: "Radial brand glow" },
];

const FC_FRAME_FINISH = [
  { value: "matte-black", label: "Matte Black", swatch: "#141313" },
  { value: "carbon", label: "Carbon Weave", swatch: "#2a2a2a" },
  { value: "graphite", label: "Graphite Brushed", swatch: "#353434" },
  { value: "obsidian", label: "Obsidian Lacquer", swatch: "#0e0e0e" },
];

const FC_PLATE_OPTIONS = [
  { value: "spec", label: "Spec Plate", desc: "Power, torque, top speed, 0–60, year" },
  { value: "edition", label: "Edition Number", desc: "Numbered out of 50" },
  { value: "owner", label: "Owner Tag", desc: "Your initials, etched" },
  { value: "none", label: "None", desc: "Unmarked, no plate" },
];

const FC_STATS = [
  { value: 50, suffix: "+", label: "Frames Delivered", sublabel: "Since 2023" },
  { value: 0,  suffix: "",  label: "Complaints",       sublabel: "Zero. Counted." },
  { value: 7,  suffix: " DAYS", label: "Standard Lead", sublabel: "Door to door" },
  { value: 100, suffix: "%", label: "Handcrafted",     sublabel: "Built to order" },
];

window.FC_PRODUCTS = FC_PRODUCTS;
window.FC_BACKGROUNDS = FC_BACKGROUNDS;
window.FC_FRAME_FINISH = FC_FRAME_FINISH;
window.FC_PLATE_OPTIONS = FC_PLATE_OPTIONS;
window.FC_STATS = FC_STATS;
