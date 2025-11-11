export interface Order {
  id: string
  trackingId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  deliveryFee: number
  total: number

  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }

  deliveryMethod: "pickup" | "door-delivery"
  deliveryDetails: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    notes?: string
  }
  pickupDetails?: {
    selectedLocation?: string
    notes?: string
  }

  paymentInfo: {
    cardName: string
    cardNumber: string
  }
  status: "pending" | "confirmed" | "processing" | "dispatched" | "with-rider" | "available-for-pickup" | "delivered"
  createdAt: string
  estimatedDelivery: string
}

export function generateTrackingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "FS"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function saveOrder(order: Order): void {
  const orders = getOrders()
  orders.push(order)
  localStorage.setItem("flowerstalk_orders", JSON.stringify(orders))
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  const orders = localStorage.getItem("flowerstalk_orders")
  return orders ? JSON.parse(orders) : []
}

export function getOrderByTrackingId(trackingId: string): Order | null {
  const orders = getOrders()
  return orders.find((order) => order.trackingId === trackingId) || null
}

export function updateOrderStatus(trackingId: string, status: Order["status"]): void {
  const orders = getOrders()
  const order = orders.find((o) => o.trackingId === trackingId)
  if (order) {
    order.status = status
    localStorage.setItem("flowerstalk_orders", JSON.stringify(orders))
  }
}
