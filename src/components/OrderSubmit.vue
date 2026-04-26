<template>
  <div class="order-submit">
    <div class="submit-left">
      <div class="select-all">
        <input 
          type="checkbox" 
          :checked="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="handleToggleAll"
          class="checkbox"
        >
        <span class="select-all-label">全选</span>
      </div>
      
      <div class="selected-info">
        <span>已选 <span class="selected-count">{{ selectedQuantity }}</span> 件商品</span>
        <span class="selected-price">
          合计：<span class="price">{{ formatPrice(selectedTotal) }}</span>
        </span>
      </div>
    </div>
    
    <div class="submit-right">
      <div class="coupon-input">
        <input 
          type="text" 
          v-model="couponCode"
          placeholder="输入优惠券码"
          class="coupon-field"
          @keyup.enter="handleApplyCoupon"
        >
        <button 
          class="coupon-btn"
          @click="handleApplyCoupon"
          :disabled="isApplyingCoupon || !couponCode.trim()"
        >
          {{ isApplyingCoupon ? '验证中...' : '使用' }}
        </button>
      </div>
      
      <button 
        class="submit-btn"
        @click="handleSubmit"
        :disabled="isSubmitting || selectedQuantity === 0"
      >
        {{ isSubmitting ? '提交中...' : '提交订单' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { CartItem, Coupon } from '@/types'
import { formatPrice, createLock, type Lock } from '@/utils'

interface Props {
  cartItems: CartItem[]
  selectedQuantity: number
  selectedTotal: number
  availableCoupons?: Coupon[]
}

interface Emits {
  (e: 'toggle-all', selectAll: boolean): void
  (e: 'apply-coupon', couponCode: string): void
  (e: 'submit-order'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const couponCode = ref('')
const isApplyingCoupon = ref(false)
const isSubmitting = ref(false)
const isTogglingAll = ref(false)

const applyCouponLock = createLock()
const submitLock = createLock()
const toggleAllLock = createLock()

const isAllSelected = computed(() => {
  return props.cartItems.length > 0 && props.cartItems.every(item => item.selected)
})

const isIndeterminate = computed(() => {
  const selectedCount = props.cartItems.filter(item => item.selected).length
  return selectedCount > 0 && selectedCount < props.cartItems.length
})

const handleToggleAll = async () => {
  if (isTogglingAll.value || !toggleAllLock.tryLock()) {
    return
  }
  
  isTogglingAll.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    emit('toggle-all', !isAllSelected.value)
  } finally {
    isTogglingAll.value = false
    toggleAllLock.unlock()
  }
}

const handleApplyCoupon = async () => {
  const code = couponCode.value.trim()
  
  if (!code || isApplyingCoupon.value || !applyCouponLock.tryLock()) {
    return
  }
  
  isApplyingCoupon.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    emit('apply-coupon', code)
  } finally {
    isApplyingCoupon.value = false
    applyCouponLock.unlock()
  }
}

const handleSubmit = async () => {
  if (props.selectedQuantity === 0 || isSubmitting.value || !submitLock.tryLock()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    emit('submit-order')
  } finally {
    isSubmitting.value = false
    submitLock.unlock()
  }
}

onUnmounted(() => {
  isApplyingCoupon.value = false
  isSubmitting.value = false
  isTogglingAll.value = false
})
</script>

<style scoped>
.order-submit {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 100;
}

.submit-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.select-all-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.selected-count {
  color: #007bff;
  font-weight: 600;
}

.selected-price {
  font-size: 14px;
  color: #666;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #e63946;
}

.submit-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.coupon-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coupon-field {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  transition: border-color 0.2s;
}

.coupon-field:focus {
  outline: none;
  border-color: #007bff;
}

.coupon-btn {
  padding: 8px 16px;
  border: 1px solid #007bff;
  background: #fff;
  color: #007bff;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.coupon-btn:hover:not(:disabled) {
  background: #007bff;
  color: #fff;
}

.coupon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  padding: 12px 40px;
  border: none;
  background: linear-gradient(135deg, #e63946 0%, #d62828 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(230, 57, 70, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

@media (max-width: 768px) {
  .order-submit {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .submit-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .submit-right {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
  
  .coupon-input {
    width: 100%;
  }
  
  .coupon-field {
    flex: 1;
    width: auto;
  }
  
  .submit-btn {
    width: 100%;
    padding: 14px;
  }
  
  .selected-info {
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
}
</style>
