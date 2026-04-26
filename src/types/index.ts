export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  stock: number
  category: string
}

export interface CartItem {
  product: Product
  quantity: number
  selected: boolean
}

export interface Cart {
  items: CartItem[]
  totalPrice: number
  totalQuantity: number
  selectedTotal: number
  selectedQuantity: number
}

export interface Order {
  id: string
  orderNo: string
  items: CartItem[]
  totalPrice: number
  discount: number
  finalPrice: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderSummary {
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  totalQuantity: number
}

export interface Coupon {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  validUntil: Date
  isActive: boolean
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
