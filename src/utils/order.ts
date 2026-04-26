import type { CartItem, Order, OrderStatus, Coupon } from '@/types'
import { generateOrderNo, calculateOrderSummary } from './price'

export const createOrder = (
  items: CartItem[],
  shippingFee: number = 0,
  coupon?: Coupon
): Order => {
  const summary = calculateOrderSummary(items, shippingFee, coupon)
  const selectedItems = items.filter(item => item.selected)
  
  const now = new Date()
  
  return {
    id: crypto.randomUUID(),
    orderNo: generateOrderNo(),
    items: selectedItems,
    totalPrice: summary.subtotal,
    discount: summary.discount,
    finalPrice: summary.total,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  }
}

export const updateOrderStatus = (
  order: Order,
  status: OrderStatus
): Order => {
  return {
    ...order,
    status,
    updatedAt: new Date()
  }
}

export const canCancelOrder = (order: Order): boolean => {
  return order.status === 'pending' || order.status === 'paid'
}

export const canModifyOrder = (order: Order): boolean => {
  return order.status === 'pending'
}

export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    pending: '#ff6b00',
    paid: '#52c41a',
    shipped: '#1890ff',
    completed: '#8c8c8c',
    cancelled: '#d9d9d9'
  }
  return colorMap[status] || '#000000'
}
