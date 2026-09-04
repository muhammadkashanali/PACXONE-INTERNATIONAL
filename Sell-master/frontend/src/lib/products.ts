export interface Category {
  id: string;
  _id?: string;
  slug?: string;
  name: string;
  description: string;
  image: string;
  parentCategory?: string | null;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  model: string;
  categoryId: string;
  description: string;
  image: string;
  datasheet?: string;
  features: string[];
  applications: string[];
  specs: { label: string; value: string }[];
  availability: "In Stock" | "On Order" | "Limited";
  featured?: boolean;
}

import automation from "@/assets/cat-automation.jpg";
import power from "@/assets/cat-power.jpg";
import drives from "@/assets/cat-drives.jpg";
import sensors from "@/assets/cat-sensors.jpg";

export const categories: Category[] = [
  { id: "automation", name: "Industrial Automation", description: "PLCs, HMIs, and control systems for smart manufacturing.", image: automation },
  { id: "power", name: "Power & Switchgear", description: "Circuit breakers, contactors, and distribution equipment.", image: power },
  { id: "drives", name: "Drives & Motors", description: "Variable frequency drives and industrial motor controls.", image: drives },
  { id: "sensors", name: "Sensors & Relays", description: "Precision sensors, relays, and monitoring devices.", image: sensors },
];

export const products: Product[] = [
  {
    id: "plc-modular-x2",
    name: "Modular PLC Controller X2",
    brand: "Pacxone",
    model: "PX-PLC-X2",
    categoryId: "automation",
    description: "High-performance modular PLC for complex industrial automation with expandable I/O and integrated Ethernet.",
    image: automation,
    features: ["Modular expansion up to 32 slots", "Dual Ethernet ports", "Integrated web server", "Real-time diagnostics"],
    applications: ["Manufacturing lines", "Process control", "Building automation", "Water treatment"],
    specs: [
      { label: "CPU", value: "ARM Cortex-A9 800 MHz" },
      { label: "Memory", value: "4 MB program / 2 MB data" },
      { label: "Communication", value: "Ethernet/IP, Modbus TCP, Profinet" },
      { label: "Power", value: "24 VDC" },
      { label: "Operating Temp", value: "-20°C to 60°C" },
    ],
    availability: "In Stock",
    featured: true,
  },
  {
    id: "hmi-touch-10",
    name: "10\" Industrial HMI Touchscreen",
    brand: "Pacxone",
    model: "PX-HMI-10T",
    categoryId: "automation",
    description: "Ruggedized 10-inch capacitive touchscreen HMI with wide-viewing IPS panel and industrial connectivity.",
    image: automation,
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
    id: "vfd-drive-22kw",
    name: "Variable Frequency Drive 22 kW",
    brand: "Pacxone",
    model: "PX-VFD-22K",
    categoryId: "drives",
    description: "Energy-efficient VFD with vector control for precise motor speed regulation across industrial applications.",
    image: drives,
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
    id: "mccb-250a",
    name: "Moulded Case Circuit Breaker 250A",
    brand: "Pacxone",
    model: "PX-MCCB-250",
    categoryId: "power",
    description: "Compact MCCB with thermal-magnetic trip unit for reliable overload and short-circuit protection.",
    image: power,
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
  {
    id: "contactor-95a",
    name: "Industrial Contactor 95A",
    brand: "Pacxone",
    model: "PX-CON-95",
    categoryId: "power",
    description: "Heavy-duty AC contactor for motor and load switching with high mechanical and electrical endurance.",
    image: power,
    features: ["AC-3 rated 95 A", "Silver alloy contacts", "24V–415V coil options", "Auxiliary block compatible"],
    applications: ["Motor starting", "Lighting circuits", "Capacitor banks"],
    specs: [
      { label: "Rated Current", value: "95 A (AC-3)" },
      { label: "Coil Voltage", value: "24–415 VAC" },
      { label: "Poles", value: "3P" },
    ],
    availability: "In Stock",
  },
  {
    id: "proximity-sensor-m18",
    name: "Inductive Proximity Sensor M18",
    brand: "Pacxone",
    model: "PX-PS-M18",
    categoryId: "sensors",
    description: "Flush-mount M18 inductive sensor with 8mm sensing range and IP67 rating for harsh environments.",
    image: sensors,
    features: ["8 mm sensing distance", "IP67 rated", "LED status indicator", "Short-circuit protection"],
    applications: ["Position detection", "End-of-travel sensing", "Object counting"],
    specs: [
      { label: "Sensing Range", value: "8 mm" },
      { label: "Output", value: "PNP NO / NC" },
      { label: "Voltage", value: "10–30 VDC" },
      { label: "Protection", value: "IP67" },
    ],
    availability: "In Stock",
  },
  {
    id: "safety-relay-24v",
    name: "Safety Relay Module 24VDC",
    brand: "Pacxone",
    model: "PX-SR-24",
    categoryId: "sensors",
    description: "SIL 3 / PL e safety relay for emergency stop and interlock monitoring in industrial machinery.",
    image: sensors,
    features: ["SIL 3 / PL e", "Dual-channel monitoring", "Automatic or manual reset", "Force-guided contacts"],
    applications: ["Emergency stop circuits", "Safety gate monitoring", "Two-hand controls"],
    specs: [
      { label: "Safety Level", value: "SIL 3 / PL e" },
      { label: "Contacts", value: "3 NO + 1 NC" },
      { label: "Supply", value: "24 VDC" },
    ],
    availability: "Limited",
  },
  {
    id: "power-supply-240w",
    name: "Din-Rail Power Supply 240W",
    brand: "Pacxone",
    model: "PX-PS-240",
    categoryId: "power",
    description: "Compact switch-mode power supply for control cabinets with wide-range input and active PFC.",
    image: power,
    features: ["24 VDC / 10 A", "Wide input 85–264 VAC", "Active PFC", "Parallel operation"],
    applications: ["Control panels", "PLC systems", "Field devices"],
    specs: [
      { label: "Output", value: "24 VDC 10 A" },
      { label: "Input", value: "85–264 VAC" },
      { label: "Efficiency", value: "≥ 93%" },
    ],
    availability: "On Order",
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getProduct = (id: string) => products.find((p) => p.id === id);