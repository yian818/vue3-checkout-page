import type { CartItem, OrderSummary, Coupon, Product } from '@/types'

export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`
}

export const calculateItemTotal = (price: number, quantity: number): number => {
  return price * quantity
}

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

export const calculateOrderSummary = (
  items: CartItem[],
  shippingFee: number = 0,
  coupon?: Coupon
): OrderSummary => {
  const selectedItems = items.filter(item => item.selected)
  
  const subtotal = selectedItems.reduce((total, item) => {
    return total + calculateItemTotal(item.product.price, item.quantity)
  }, 0)
  
  const totalQuantity = selectedItems.reduce((total, item) => {
    return total + item.quantity
  }, 0)
  
  let discount = 0
  
  if (coupon && coupon.isActive && new Date() <= coupon.validUntil) {
    if (subtotal >= coupon.minPurchase) {
      if (coupon.discountType === 'percentage') {
        discount = subtotal * (coupon.discountValue / 100)
      } else {
        discount = coupon.discountValue
      }
      discount = Math.min(discount, subtotal)
    }
  }
  
  const total = Math.max(0, subtotal - discount + shippingFee)
  
  return {
    subtotal,
    discount,
    shippingFee,
    total,
    totalQuantity
  }
}

export const generateOrderNo = (): string => {
  const now = new Date()
  const timestamp = now.getTime().toString()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD${timestamp.slice(-10)}${random}`
}

export const validateStock = (product: Product, quantity: number): boolean => {
  return quantity >= 0 && quantity <= product.stock
}

export const calculateSavings = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    if (item.product.originalPrice) {
      const originalTotal = item.product.originalPrice * item.quantity
      const currentTotal = item.product.price * item.quantity
      return total + (originalTotal - currentTotal)
    }
    return total
  }, 0)
}
