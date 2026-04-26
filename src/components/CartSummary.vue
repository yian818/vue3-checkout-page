<template>
  <div class="cart-summary">
    <div class="summary-header">
      <h3>订单摘要</h3>
    </div>
    
    <div class="summary-content">
      <div class="summary-row">
        <span class="summary-label">商品件数：</span>
        <span class="summary-value">{{ orderSummary.totalQuantity }} 件</span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">商品总价：</span>
        <span class="summary-value">{{ formatPrice(orderSummary.subtotal) }}</span>
      </div>
      
      <div 
        v-if="orderSummary.discount > 0" 
        class="summary-row discount-row"
      >
        <span class="summary-label">优惠券优惠：</span>
        <span class="summary-value discount-value">
          -{{ formatPrice(orderSummary.discount) }}
        </span>
      </div>
      
      <div class="summary-row">
        <span class="summary-label">运费：</span>
        <span class="summary-value">
          {{ orderSummary.shippingFee > 0 ? formatPrice(orderSummary.shippingFee) : '免运费' }}
        </span>
      </div>
      
      <div class="summary-divider"></div>
      
      <div class="summary-row total-row">
        <span class="summary-label total-label">应付金额：</span>
        <span class="summary-value total-value">{{ formatPrice(orderSummary.total) }}</span>
      </div>
    </div>
    
    <div 
      v-if="savings > 0" 
      class="savings-info"
    >
      <span class="savings-icon">🎉</span>
      <span class="savings-text">已为您节省 {{ formatPrice(savings) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderSummary, CartItem } from '@/types'
import { formatPrice, calculateSavings } from '@/utils'

interface Props {
  orderSummary: OrderSummary
  cartItems: CartItem[]
}

const props = defineProps<Props>()

const savings = computed(() => {
  return calculateSavings(props.cartItems)
})
</script>

<style scoped>
.cart-summary {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.summary-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 14px;
  color: #666;
}

.summary-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.discount-row {
  background: #fff1f0;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 4px -12px;
}

.discount-value {
  color: #e63946;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.total-row {
  padding-top: 8px;
}

.total-label {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.total-value {
  font-size: 20px;
  color: #e63946;
  font-weight: 700;
}

.savings-info {
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff0f6 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.savings-icon {
  font-size: 16px;
}

.savings-text {
  font-size: 13px;
  color: #e63946;
  font-weight: 500;
}
</style>
