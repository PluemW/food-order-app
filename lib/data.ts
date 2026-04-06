export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: "main-dish" | "soup" | "side" | "noodles" | "snacks" | "bread" | "drinks";
  description: string;
  icon: string;
  requiresSpiceLevel?: boolean;
  requiresSweetnessLevel?: boolean;
  requiresExtraSize?: boolean;
  requiresTemperature?: boolean;
}

export type OrderStatus = "pending" | "cooking" | "waiting-for-payment" | "completed"

export interface OrderItem {
  menuId: number
  qty: number
  option?: string
  extraSize?: boolean
  temperature?: "hot" | "cold"
}

export interface Order {
  id: number
  customerName: string
  items: OrderItem[]
  status: OrderStatus
  createdAt: number
  updatedAt: number
  notes?: string
  remake?: boolean
  orderType?: "delivery" | "dine-in"
  tableNumber?: string
  phone?: string
}

export interface MenuItemWithDetails extends MenuItem {
  // Extended for API responses
}

export const menus: MenuItem[] = [
  // Main dishes
  {
    id: 1,
    name: "ผัดกระเพราหมูราดข้าว",
    price: 50,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍛",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 2,
    name: "ผัดกระเพราเนื้อราดข้าว",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍛",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 3,
    name: "ผัดกระเพราทะเลราดข้าว",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍛",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  { id: 4, name: "ข้าวผัดหมู", price: 50, category: "main-dish", description: "ข้าวผัดหอม ๆ พร้อมหมูชิ้นพอดีคำ", icon: "🍚", requiresExtraSize: true },
  { id: 5, name: "ข้าวผัดทะเล", price: 60, category: "main-dish", description: "ข้าวผัดทะเลสดพร้อมซีฟู้ดเต็มคำ", icon: "🍚", requiresExtraSize: true },
  {
    id: 6,
    name: "ข้าวยำไก่แซ่บ",
    price: 50,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍗",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 7,
    name: "ข้าวยำหมูย่าง",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍖",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 8,
    name: "ข้าวหมูย่างจิ้มแจ่ว",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍖",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 9,
    name: "สามชั้นคั่วพริกเกลือราดข้าว",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🥓",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  {
    id: 10,
    name: "ทะเลคั่วพริกเกลือราดข้าว",
    price: 60,
    category: "main-dish",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🦐",
    requiresSpiceLevel: true,
    requiresExtraSize: true,
  },
  { id: 11, name: "ข้าวหน้าเนื้อ", price: 100, category: "main-dish", description: "ข้าวหน้าเนื้อรสเข้มข้น", icon: "🥩", requiresExtraSize: true },

  // Soups
  {
    id: 12,
    name: "ต้มยำรวมมิตร (น้ำข้น)",
    price: 120,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍲",
    requiresSpiceLevel: true,
  },
  {
    id: 13,
    name: "ต้มยำปลาคัง",
    price: 150,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍲",
    requiresSpiceLevel: true,
  },
  {
    id: 14,
    name: "ต้มยำทะเล",
    price: 100,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍲",
    requiresSpiceLevel: true,
  },
  {
    id: 15,
    name: "ต้มยำกุ้ง (น้ำข้น)",
    price: 100,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🦐",
    requiresSpiceLevel: true,
  },
  { id: 16, name: "ต้มจืดเต้าหู้หมูสับ", price: 60, category: "soup", description: "ซุปใสเรียบง่าย", icon: "🥣" },
  { id: 17, name: "ต้มจืดไข่น้ำ", price: 60, category: "soup", description: "ไข่ใสนุ่มลิ้น", icon: "🥚" },
  {
    id: 18,
    name: "มาม่าต้มยำทะเล",
    price: 60,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍜",
    requiresSpiceLevel: true,
  },
  {
    id: 19,
    name: "มาม่าต้มยำกุ้ง",
    price: 60,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍜",
    requiresSpiceLevel: true,
  },
  {
    id: 20,
    name: "มาม่าต้มยำหมูสับ",
    price: 50,
    category: "soup",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍜",
    requiresSpiceLevel: true,
  },

  // Side dishes
  { id: 21, name: "ไก่ทอดน้ำปลา", price: 80, category: "side", description: "ไก่ทอดกรอบรสเข้มข้น", icon: "🍗" },
  { id: 22, name: "หมูแดดเดียว", price: 70, category: "side", description: "หมูแดดเดียวเคี้ยวหนึบ", icon: "🥓" },
  {
    id: 23,
    name: "หมูย่างจิ้มแจ่ว",
    price: 80,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍖",
    requiresSpiceLevel: true,
  },
  {
    id: 24,
    name: "หมูมะนาว",
    price: 80,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🥩",
    requiresSpiceLevel: true,
  },
  {
    id: 25,
    name: "กุ้งแช่น้ำปลา",
    price: 120,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍤",
    requiresSpiceLevel: true,
  },
  { id: 26, name: "กุ้งอบวุ้นเส้น", price: 100, category: "side", description: "กุ้งอบวุ้นเส้นหอม", icon: "🍤" },
  {
    id: 27,
    name: "ยำไข่ดาว",
    price: 60,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🥚",
    requiresSpiceLevel: true,
  },
  {
    id: 28,
    name: "ยำไก่แซ่บ",
    price: 70,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍗",
    requiresSpiceLevel: true,
  },
  { id: 29, name: "ไข่เจียว", price: 50, category: "side", description: "ไข่เจียวฟูหอมนุ่ม", icon: "🍳" },
  { id: 30, name: "ไข่เจียวหมูสับ", price: 60, category: "side", description: "ไข่เจียวผสมหมูสับ", icon: "🍳" },
  { id: 31, name: "ไข่เจียวกุ้ง", price: 80, category: "side", description: "ไข่เจียวกุ้งกรุบ", icon: "🍳" },
  {
    id: 32,
    name: "สามชั้นคั่วพริกเกลือ",
    price: 100,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🥓",
    requiresSpiceLevel: true,
  },
  {
    id: 33,
    name: "ทะเลคั่วพริกเกลือ",
    price: 120,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🦞",
    requiresSpiceLevel: true,
  },
  {
    id: 34,
    name: "ลาบหมู",
    price: 80,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🥩",
    requiresSpiceLevel: true,
  },
  {
    id: 35,
    name: "แกงป่าปลาคัง",
    price: 150,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🐟",
    requiresSpiceLevel: true,
  },
  {
    id: 36,
    name: "กระเพราปลาคัง",
    price: 150,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🐟",
    requiresSpiceLevel: true,
  },
  {
    id: 37,
    name: "ผัดฉ่าปลาคัง",
    price: 150,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🐟",
    requiresSpiceLevel: true,
  },
  { id: 38, name: "ปลาคังทอดกระเทียม", price: 150, category: "side", description: "ปลาคังทอดกรอบ", icon: "🐟" },
  {
    id: 39,
    name: "ปลาคังลวกจิ้ม",
    price: 150,
    category: "side",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🐟",
    requiresSpiceLevel: true,
  },

  // Noodles
  { id: 40, name: "ก๋วยเตี๋ยวคั่วไก่", price: 50, category: "noodles", description: "ก๋วยเตี๋ยวคั่วไก่กลมกล่อม", icon: "🍜", requiresExtraSize: true },
  { id: 41, name: "ก๋วยเตี๋ยวคั่วทะเล", price: 60, category: "noodles", description: "ก๋วยเตี๋ยวคั่วทะเลสด", icon: "🍜", requiresExtraSize: true },
  {
    id: 42,
    name: "ยำวุ้นเส้นหมูยอ",
    price: 69,
    category: "noodles",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍝",
    requiresSpiceLevel: true,
  },
  {
    id: 43,
    name: "ยำวุ้นเส้นทะเล",
    price: 79,
    category: "noodles",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍝",
    requiresSpiceLevel: true,
  },
  {
    id: 44,
    name: "ยำมาม่าหมูยอ",
    price: 69,
    category: "noodles",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍜",
    requiresSpiceLevel: true,
  },
  {
    id: 45,
    name: "ยำมาม่าทะเล",
    price: 79,
    category: "noodles",
    description: "เลือกระดับความเผ็ดได้",
    icon: "🍜",
    requiresSpiceLevel: true,
  },

  // Snacks
  { id: 46, name: "เฟรนช์ฟรายส์", price: 39, category: "snacks", description: "ทานเล่นกรอบอร่อย", icon: "🍟" },
  { id: 47, name: "ปูอัดวาซาบิ", price: 60, category: "snacks", description: "ปูอัดราดวาซาบิสดชื่น", icon: "🦀" },
  { id: 48, name: "ไก่ป๊อป", price: 69, category: "snacks", description: "ไก่ป๊อปกรอบร้อน ๆ", icon: "🍗" },

  // Bread
  { id: 49, name: "ขนมปังเนย-นม", price: 15, category: "bread", description: "ขนมปังเนยนุ่ม", icon: "🍞" },
  { id: 50, name: "ขนมปังเนย-น้ำตาล", price: 15, category: "bread", description: "ขนมปังรสหวานพอดี", icon: "🍞" },
  { id: 51, name: "ขนมปังช็อกโกแลต-นม", price: 20, category: "bread", description: "ขนมปังช็อกโกแลตร้อน", icon: "🍫" },
  { id: 52, name: "ขนมปังโอวัลติน-นม", price: 20, category: "bread", description: "ขนมปังโอวัลตินหอม", icon: "🍫" },
  { id: 53, name: "ขนมปังโอวัลติน-ช็อกโกแลต", price: 20, category: "bread", description: "ขนมปังโอวัลตินเข้มข้น", icon: "🍫" },
  { id: 54, name: "ขนมปังโอริโอ้-นม", price: 25, category: "bread", description: "ขนมปังโอริโอ้เพิ่มความหวาน", icon: "🍪" },
  { id: 55, name: "ขนมปังโอริโอ้-ช็อกโกแลต", price: 25, category: "bread", description: "ขนมปังโอริโอ้เข้มข้น", icon: "🍪" },
  { id: 56, name: "ขนมปังกล้วย-ช็อกโกแลต", price: 25, category: "bread", description: "ขนมปังกล้วยหอม", icon: "🍌" },
  { id: 57, name: "ขนมปังสังขยาใบเตย", price: 25, category: "bread", description: "ขนมปังสังขยาใบเตยหอม", icon: "🥥" },
  { id: 58, name: "ขนมปังโอริโอ้ภูเขาไฟ", price: 35, category: "bread", description: "ขนมปังโอริโอ้ภูเขาไฟ", icon: "🍪" },
  { id: 59, name: "ขนมปังนึ่งสังขยา", price: 45, category: "bread", description: "ขนมปังนึ่งนุ่มสังขยา", icon: "🥥" },

  // Drinks
  {
    id: 60,
    name: "นมสด",
    price: 20,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    icon: "🥛",
    requiresSweetnessLevel: true,
    requiresTemperature: true,
  },
  {
    id: 61,
    name: "นมชมพู",
    price: 25,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    icon: "🥤",
    requiresSweetnessLevel: true,
    requiresTemperature: true,
  },
  {
    id: 62,
    name: "โอวัลติน",
    price: 25,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    icon: "🍫",
    requiresTemperature: true,
    requiresSweetnessLevel: true,
  },
  {
    id: 63,
    name: "โกโก้",
    price: 25,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    icon: "🍫",
    requiresTemperature: true,
    requiresSweetnessLevel: true,
  },
  {
    id: 64,
    name: "ไมโล",
    price: 25,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    requiresTemperature: true,
    icon: "🥛",
    requiresSweetnessLevel: true,
  },
  {
    id: 65,
    name: "เนสวีต้า",
    price: 30,
    category: "drinks",
    description: "ร้อน/เย็น ปรับระดับความหวานได้",
    icon: "🥛",
    requiresSweetnessLevel: true,
    requiresTemperature: true,
  },
  {
    id: 66,
    name: "น้ำแดงโซดา",
    price: 30,
    category: "drinks",
    description: "ปรับระดับความหวานได้",
    icon: "🧃",
    requiresSweetnessLevel: true,
  },
  {
    id: 67,
    name: "น้ำเขียวโซดา",
    price: 30,
    category: "drinks",
    description: "ปรับระดับความหวานได้",
    icon: "🧃",
    requiresSweetnessLevel: true,
  },
  {
    id: 68,
    name: "น้ำแดงโซดามะนาว",
    price: 35,
    category: "drinks",
    description: "ปรับระดับความหวานได้",
    icon: "🍋",
    requiresSweetnessLevel: true,
  },
  {
    id: 69,
    name: "น้ำเขียวโซดามะนาว",
    price: 35,
    category: "drinks",
    description: "ปรับระดับความหวานได้",
    icon: "🍋",
    requiresSweetnessLevel: true,
  },
]

export const categories = [
  { key: "main-dish", label: "เมนูอาหารจานเดียว" },
  { key: "soup", label: "เมนูต้ม" },
  { key: "side", label: "กับข้าว" },
  { key: "noodles", label: "เมนูเส้น" },
  { key: "snacks", label: "อาหารทานเล่น" },
  { key: "bread", label: "เมนูขนมปัง" },
  { key: "drinks", label: "เครื่องดื่ม" },
]

// Sample orders for testing
export const sampleOrders: Order[] = [
  {
    id: 1001,
    customerName: "John Smith",
    items: [
      { menuId: 4, qty: 1 },
      { menuId: 9, qty: 2 },
    ],
    status: "pending",
    createdAt: Date.now() - 300000, // 5 mins ago
    updatedAt: Date.now() - 300000,
  },
  {
    id: 1002,
    customerName: "Sarah Johnson",
    items: [
      { menuId: 5, qty: 1 },
      { menuId: 6, qty: 1 },
      { menuId: 13, qty: 1 },
    ],
    status: "cooking",
    createdAt: Date.now() - 600000, // 10 mins ago
    updatedAt: Date.now() - 120000,
  },
  {
    id: 1003,
    customerName: "Mike Chen",
    items: [
      { menuId: 7, qty: 2 },
      { menuId: 10, qty: 1 },
    ],
    status: "waiting-for-payment",
    createdAt: Date.now() - 1200000, // 20 mins ago
    updatedAt: Date.now() - 60000,
  },
]

export function getMenuItemName(menuId: number): string {
  return menus.find(m => m.id === menuId)?.name || "Unknown Item"
}

export function getMenuItemIcon(menuId: number): string {
  return menus.find(m => m.id === menuId)?.icon || "🍽️"
}