<template>
  <div class="checkout-page">
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">购物车结算</h1>
        <div class="header-actions">
          <button 
            class="clear-btn"
            @click="handleClearSelected"
            :disabled="selectedQuantity === 0"
          >
            清除已选
          </button>
        </div>
      </div>
    </header>
    
    <main class="page-main">
      <div class="main-content">
        <div class="content-left">
          <ProductList
            :cart-items="cartItems"
            @toggle-selection="handleToggleSelection"
            @update-quantity="handleUpdateQuantity"
            @remove-item="handleRemoveItem"
          />
          
          <div class="recommend-section" v-if="filteredRecommendedProducts.length > 0">
            <RecommendPanel
              :products="filteredRecommendedProducts"
              @add-to-cart="handleAddToCart"
              @add-success="handleAddSuccess"
              @add-error="handleAddError"
            />
          </div>
        </div>
        
        <div class="content-right">
          <CartSummary
            :order-summary="orderSummary"
            :cart-items="cartItems"
          />
          
          <div class="coupon-section" v-if="appliedCoupon">
            <div class="coupon-info">
              <span class="coupon-label">已使用优惠券：</span>
              <span class="coupon-code">{{ appliedCoupon.code }}</span>
              <button class="remove-coupon-btn" @click="handleRemoveCoupon">
                取消
              </button>
            </div>
            <div class="coupon-desc">
              {{ getCouponDescription(appliedCoupon) }}
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="page-footer">
      <OrderSubmit
        :cart-items="cartItems"
        :selected-quantity="cartStats.selectedQuantity"
        :selected-total="cartStats.selectedTotal"
        :available-coupons="availableCoupons"
        @toggle-all="handleToggleAll"
        @apply-coupon="handleApplyCoupon"
        @submit-order="handleSubmitOrder"
      />
    </footer>
    
    <div 
      v-if="showSuccessModal" 
      class="modal-overlay"
      @click="closeSuccessModal"
    >
      <div 
        class="success-modal"
        @click.stop
      >
        <div class="success-icon">✓</div>
        <h3 class="success-title">订单提交成功！</h3>
        <div class="success-info">
          <p>订单号：<span class="order-no">{{ submittedOrder?.orderNo }}</span></p>
          <p>应付金额：<span class="order-amount">{{ formatPrice(submittedOrder?.finalPrice || 0) }}</span></p>
          <p>订单状态：<span class="order-status">{{ getOrderStatusText(submittedOrder?.status || 'pending') }}</span></p>
        </div>
        <button class="close-btn" @click="closeSuccessModal">
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { CartItem, Order, Coupon, OrderSummary, Product } from '@/types'
import { 
  addToCart, 
  toggleItemSelection, 
  toggleAllSelection, 
  updateQuantity, 
  removeFromCart, 
  getCartStats, 
  clearSelected,
  calculateOrderSummary,
  createOrder,
  getOrderStatusText,
  formatPrice,
  createLock,
  type Lock
} from '@/utils'
import { mockProducts, mockCoupons, recommendedProducts } from '@/data/mockData'
import ProductList from './ProductList.vue'
import CartSummary from './CartSummary.vue'
import OrderSubmit from './OrderSubmit.vue'
import RecommendPanel from './RecommendPanel.vue'

const cartItems = ref<CartItem[]>([])
const appliedCoupon = ref<Coupon | null>(null)
const showSuccessModal = ref(false)
const submittedOrder = ref<Order | null>(null)

const availableCoupons = ref<Coupon[]>(mockCoupons)
const addToCartLock = createLock()
const addingProductIds = ref<Set<string>>(new Set())

const cartStats = computed(() => {
  return getCartStats(cartItems.value)
})

const selectedQuantity = computed(() => cartStats.value.selectedQuantity)

const shippingFee = computed(() => {
  const { selectedTotal } = cartStats.value
  return selectedTotal >= 99 ? 0 : 10
})

const orderSummary = computed<OrderSummary>(() => {
  return calculateOrderSummary(
    cartItems.value,
    shippingFee.value,
    appliedCoupon.value || undefined
  )
})

const cartProductIds = computed(() => {
  return new Set(cartItems.value.map(item => item.product.id))
})

const filteredRecommendedProducts = computed(() => {
  return recommendedProducts.filter(
    product => !cartProductIds.value.has(product.id)
  )
})

const handleToggleSelection = (productId: string) => {
  cartItems.value = toggleItemSelection(cartItems.value, productId)
}

const handleToggleAll = (selectAll: boolean) => {
  cartItems.value = toggleAllSelection(cartItems.value, selectAll)
}

const handleUpdateQuantity = (productId: string, quantity: number) => {
  cartItems.value = updateQuantity(cartItems.value, productId, quantity)
}

const handleRemoveItem = (productId: string) => {
  cartItems.value = removeFromCart(cartItems.value, productId)
}

const handleAddToCart = async (product: Product) => {
  if (product.stock <= 0) {
    return
  }
  
  if (cartProductIds.value.has(product.id)) {
    return
  }
  
  if (addingProductIds.value.has(product.id)) {
    return
  }
  
  if (!addToCartLock.tryLock()) {
    return
  }
  
  try {
    addingProductIds.value.add(product.id)
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    cartItems.value = addToCart(cartItems.value, product, 1)
    
  } finally {
    addingProductIds.value.delete(product.id)
    addToCartLock.unlock()
  }
}

const handleAddSuccess = (product: Product) => {
  console.log(`商品 ${product.name} 已成功加入购物车`)
}

const handleAddError = (product: Product, error: Error) => {
  console.error(`商品 ${product.name} 加入购物车失败:`, error)
}

const handleClearSelected = () => {
  cartItems.value = clearSelected(cartItems.value)
  appliedCoupon.value = null
}

const handleApplyCoupon = (couponCode: string) => {
  const coupon = availableCoupons.value.find(
    c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive
  )
  
  if (coupon) {
    const now = new Date()
    if (now > coupon.validUntil) {
      alert('优惠券已过期')
      return
    }
    
    if (orderSummary.value.subtotal < coupon.minPurchase) {
      alert(`满${coupon.minPurchase}元才能使用此优惠券`)
      return
    }
    
    appliedCoupon.value = coupon
  } else {
    alert('优惠券无效')
  }
}

const handleRemoveCoupon = () => {
  appliedCoupon.value = null
}

const handleSubmitOrder = () => {
  if (cartStats.value.selectedQuantity === 0) {
    alert('请选择要购买的商品')
    return
  }
  
  const order = createOrder(
    cartItems.value,
    shippingFee.value,
    appliedCoupon.value || undefined
  )
  
  submittedOrder.value = order
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  submittedOrder.value = null
  cartItems.value = clearSelected(cartItems.value)
  appliedCoupon.value = null
}

const getCouponDescription = (coupon: Coupon): string => {
  if (coupon.discountType === 'percentage') {
    return `满${coupon.minPurchase}元减${coupon.discountValue}%`
  }
  return `满${coupon.minPurchase}元减${coupon.discountValue}元`
}

onMounted(() => {
  if (mockProducts.length > 0) {
    let items: CartItem[] = []
    mockProducts.slice(0, 3).forEach((product, index) => {
      items = addToCart(items, product, index + 1)
    })
    cartItems.value = items
  }
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.page-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.clear-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover:not(:disabled) {
  border-color: #e63946;
  color: #e63946;
  background: #fff1f0;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-main {
  flex: 1;
  padding: 24px;
  padding-bottom: 100px;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.content-left {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recommend-section {
  width: 100%;
}

.content-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.coupon-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.coupon-label {
  font-size: 14px;
  color: #666;
}

.coupon-code {
  font-size: 14px;
  font-weight: 600;
  color: #007bff;
  background: #e6f2ff;
  padding: 4px 8px;
  border-radius: 4px;
}

.remove-coupon-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.remove-coupon-btn:hover {
  color: #e63946;
}

.coupon-desc {
  font-size: 13px;
  color: #999;
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.success-modal {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  animation: slideUp 0.3s ease;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: #fff;
  font-weight: bold;
}

.success-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.success-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.success-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

.order-no,
.order-amount,
.order-status {
  font-weight: 600;
  color: #333;
}

.order-amount {
  color: #e63946;
}

.order-status {
  color: #ff6b00;
}

.close-btn {
  width: 100%;
  padding: 14px;
  border: none;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .content-right {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-main {
    padding: 16px;
    padding-bottom: 160px;
  }
  
  .header-content {
    padding: 12px 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
}
</style>
