import type { CartItem, Product } from '@/types'
import { calculateItemTotal, validateStock } from './price'

export const addToCart = (
  cartItems: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] => {
  if (!validateStock(product, quantity)) {
    console.warn('库存不足')
    return cartItems
  }
  
  const existingIndex = cartItems.findIndex(
    item => item.product.id === product.id
  )
  
  if (existingIndex >= 0) {
    const newQuantity = cartItems[existingIndex].quantity + quantity
    if (!validateStock(product, newQuantity)) {
      console.warn('超出库存限制')
      return cartItems
    }
    
    return cartItems.map((item, index) => {
      if (index === existingIndex) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })
  }
  
  return [
    ...cartItems,
    {
      product,
      quantity,
      selected: true
    }
  ]
}

export const removeFromCart = (
  cartItems: CartItem[],
  productId: string
): CartItem[] => {
  return cartItems.filter(item => item.product.id !== productId)
}

export const updateQuantity = (
  cartItems: CartItem[],
  productId: string,
  quantity: number
): CartItem[] => {
  const item = cartItems.find(item => item.product.id === productId)
  
  if (!item) return cartItems
  
  if (!validateStock(item.product, quantity)) {
    console.warn('超出库存限制')
    return cartItems
  }
  
  if (quantity <= 0) {
    return removeFromCart(cartItems, productId)
  }
  
  return cartItems.map(item => {
    if (item.product.id === productId) {
      return { ...item, quantity }
    }
    return item
  })
}

export const toggleItemSelection = (
  cartItems: CartItem[],
  productId: string
): CartItem[] => {
  return cartItems.map(item => {
    if (item.product.id === productId) {
      return { ...item, selected: !item.selected }
    }
    return item
  })
}

export const toggleAllSelection = (
  cartItems: CartItem[],
  selectAll: boolean
): CartItem[] => {
  return cartItems.map(item => ({ ...item, selected: selectAll }))
}

export const getCartStats = (cartItems: CartItem[]) => {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + calculateItemTotal(item.product.price, item.quantity),
    0
  )
  
  const selectedItems = cartItems.filter(item => item.selected)
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + calculateItemTotal(item.product.price, item.quantity),
    0
  )
  
  return {
    totalQuantity,
    totalPrice,
    selectedQuantity,
    selectedTotal
  }
}

export const clearCart = (): CartItem[] => {
  return []
}

export const clearSelected = (cartItems: CartItem[]): CartItem[] => {
  return cartItems.filter(item => !item.selected)
}
