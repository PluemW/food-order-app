export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: "appetizer" | "main" | "drinks" | "desserts";
  description: string;
  icon: string;
}

export type OrderStatus = "pending" | "cooking" | "waiting-for-payment" | "completed"

export interface OrderItem {
  menuId: number
  qty: number
  extraSize?: boolean
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
  // Appetizers
  { id: 1, name: "Spring Rolls", price: 35, category: "appetizer", description: "Crispy rolls with fresh vegetables", icon: "🥒" },
  { id: 2, name: "Satay", price: 45, category: "appetizer", description: "Grilled meat skewers with peanut sauce", icon: "🍢" },
  { id: 3, name: "Edamame", price: 30, category: "appetizer", description: "Steamed soybean pods with sea salt", icon: "🫘" },

  // Mains
  { id: 4, name: "Fried Rice", price: 50, category: "main", description: "Jasmine rice with egg, vegetables, and protein", icon: "🍚" },
  { id: 5, name: "Pad Thai", price: 60, category: "main", description: "Stir-fried noodles with shrimp, egg, and veggies", icon: "🍜" },
  { id: 6, name: "Green Curry", price: 70, category: "main", description: "Creamy coconut curry with basil and chicken", icon: "🥘" },
  { id: 7, name: "Tom Yum", price: 80, category: "main", description: "Spicy hot and sour soup with shrimp and mushrooms", icon: "🍲" },
  { id: 8, name: "Massaman Curry", price: 75, category: "main", description: "Rich peanut curry with beef and potatoes", icon: "🍛" },

  // Drinks
  { id: 9, name: "Thai Iced Tea", price: 25, category: "drinks", description: "Sweet and creamy traditional Thai tea", icon: "🧋" },
  { id: 10, name: "Mango Smoothie", price: 30, category: "drinks", description: "Fresh mango blended with coconut milk", icon: "🥤" },
  { id: 11, name: "Lemongrass Iced Tea", price: 22, category: "drinks", description: "Refreshing citrusy tea served cold", icon: "🍋" },
  { id: 12, name: "Coconut Water", price: 20, category: "drinks", description: "Fresh young coconut water", icon: "🥥" },

  // Desserts
  { id: 13, name: "Mango Sticky Rice", price: 45, category: "desserts", description: "Sweet sticky rice with fresh mango", icon: "🍚" },
  { id: 14, name: "Coconut Ice Cream", price: 35, category: "desserts", description: "Creamy homemade coconut ice cream", icon: "🍦" },
  { id: 15, name: "Banana Roti", price: 40, category: "desserts", description: "Crispy roti with banana, condensed milk, and chocolate", icon: "🍌" },
]

export const categories = [
  { key: "appetizer", label: "อาหารเรียกน้ำย่อย" },
  { key: "main", label: "อาหารจานหลัก" },
  { key: "drinks", label: "เครื่องดื่ม" },
  { key: "desserts", label: "ของหวาน" },
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