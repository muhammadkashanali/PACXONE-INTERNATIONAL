import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const defaultCategories = [
  {
    name: "Industrial Automation",
    description: "PLCs, HMIs, and control systems for smart manufacturing.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    slug: "industrial-automation",
  },
  {
    name: "Power & Switchgear",
    description: "Circuit breakers, contactors, and distribution equipment.",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=900&q=80",
    slug: "power-switchgear",
  },
  {
    name: "Drives & Motors",
    description: "Variable frequency drives and industrial motor controls.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    slug: "drives-motors",
  },
  {
    name: "Sensors & Relays",
    description: "Precision sensors, relays, and monitoring devices.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    slug: "sensors-relays",
  },
];

const defaultProducts = [
  {
    name: "Modular PLC Controller X2",
    brand: "Pacxone",
    model: "PX-PLC-X2",
    slug: "modular-plc-controller-x2",
    categoryId: "industrial-automation",
    description: "High-performance modular PLC for complex industrial automation with expandable I/O and integrated Ethernet.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
    features: ["Modular expansion up to 32 slots", "Dual Ethernet ports", "Integrated web server", "Real-time diagnostics"],
    applications: ["Manufacturing lines", "Process control", "Building automation", "Water treatment"],
    specs: [
      { label: "CPU", value: "ARM Cortex-A9 800 MHz" },
      { label: "Memory", value: "4 MB program / 2 MB data" },
      { label: "Communication", value: "Ethernet/IP, Modbus TCP, Profinet" },
      { label: "Power", value: "24 VDC" },
    ],
    availability: "In Stock",
    featured: true,
  },
  {
    name: "10\" Industrial HMI Touchscreen",
    brand: "Pacxone",
    model: "PX-HMI-10T",
    slug: "industrial-hmi-touchscreen-10",
    categoryId: "industrial-automation",
    description: "Ruggedized 10-inch capacitive touchscreen HMI with wide-viewing IPS panel and industrial connectivity.",
    image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80",
    features: ["10.1\" IPS 1280×800", "Capacitive multi-touch", "IP66 front bezel", "USB / Ethernet / Serial"],
    applications: ["Machine interfaces", "SCADA panels", "Operator stations"],
    specs: [
      { label: "Display", value: "10.1\" IPS 1280×800" },
      { label: "Touch", value: "Projected capacitive" },
      { label: "IP Rating", value: "IP66 (front)" },
      { label: "Power", value: "24 VDC" },
    ],
    availability: "In Stock",
    featured: true,
  },
  {
    name: "Variable Frequency Drive 22 kW",
    brand: "Pacxone",
    model: "PX-VFD-22K",
    slug: "variable-frequency-drive-22-kw",
    categoryId: "drives-motors",
    description: "Energy-efficient VFD with vector control for precise motor speed regulation across industrial applications.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    features: ["Sensorless vector control", "Built-in EMC filter", "Integrated braking chopper", "Modbus RTU"],
    applications: ["Pumps and fans", "Conveyors", "Compressors", "HVAC"],
    specs: [
      { label: "Power", value: "22 kW / 30 HP" },
      { label: "Input", value: "380–480 VAC 3-phase" },
      { label: "Output Freq", value: "0–400 Hz" },
      { label: "Protection", value: "IP20" },
    ],
    availability: "In Stock",
    featured: true,
  },
  {
    name: "Moulded Case Circuit Breaker 250A",
    brand: "Pacxone",
    model: "PX-MCCB-250",
    slug: "moulded-case-circuit-breaker-250a",
    categoryId: "power-switchgear",
    description: "Compact MCCB with thermal-magnetic trip unit for reliable overload and short-circuit protection.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    features: ["Adjustable thermal trip", "50 kA breaking capacity", "Rotary handle option", "Auxiliary contacts"],
    applications: ["Main distribution", "Motor protection", "Industrial panels"],
    specs: [
      { label: "Current", value: "250 A" },
      { label: "Voltage", value: "690 VAC" },
      { label: "Breaking Capacity", value: "50 kA @ 415V" },
      { label: "Poles", value: "3P / 4P" },
    ],
    availability: "In Stock",
    featured: true,
  },
];

export const seedDefaultData = async () => {
  const adminEmail = "admin@pacxone.com";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hash,
      role: "admin",
    });
  }

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany(defaultCategories);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const categoriesMap = await Category.find({});
    const categoryLookup = Object.fromEntries(categoriesMap.map((cat) => [cat.slug, cat._id]));

    const productsToInsert = defaultProducts.map((item) => ({
      ...item,
      category: categoryLookup[item.categoryId],
    }));

    await Product.insertMany(productsToInsert);
  }
};
