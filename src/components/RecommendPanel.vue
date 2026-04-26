<template>
  <div class="recommend-panel">
    <div class="panel-header">
      <h3 class="panel-title">猜你喜欢</h3>
      <span class="panel-subtitle">为您精选的好物推荐</span>
    </div>
    
    <div class="panel-content">
      <div 
        v-if="products.length === 0" 
        class="empty-recommend"
      >
        <p>暂无推荐商品</p>
      </div>
      
      <div 
        v-else
        class="recommend-list"
      >
        <div 
          v-for="product in products" 
          :key="product.id"
          class="recommend-item"
          :class="{ 
            'adding': isAdding(product.id),
            'added': isAdded(product.id)
          }"
        >
          <div class="product-image">
            <img 
              :src="product.image" 
              :alt="product.name"
              @error="handleImageError($event)"
              :class="{ 'loading': isImageLoading(product.id) }"
            >
            <div 
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="discount-badge"
            >
              -{{ calculateDiscount(product.originalPrice, product.price) }}%
            </div>
            
            <div 
              v-if="isAdding(product.id)" 
              class="adding-overlay"
            >
              <div class="loading-spinner"></div>
              <span class="adding-text">加入中...</span>
            </div>
            
            <div 
              v-if="isAdded(product.id)" 
              class="added-overlay"
            >
              <div class="added-icon">✓</div>
              <span class="added-text">已加入</span>
            </div>
          </div>
          
          <div class="product-info">
            <h4 class="product-name" :title="product.name">{{ product.name }}</h4>
            <p class="product-desc" :title="product.description">{{ product.description }}</p>
            
            <div class="product-price">
              <span class="current-price">{{ formatPrice(product.price) }}</span>
              <span 
                v-if="product.originalPrice && product.originalPrice > product.price" 
                class="original-price"
              >
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>
          </div>
          
          <div class="product-action">
            <button 
              class="add-btn"
              @click="handleAddToCart(product)"
              :disabled="isButtonDisabled(product)"
              :class="{ 
                'disabled': isButtonDisabled(product),
                'adding': isAdding(product.id),
                'added': isAdded(product.id)
              }"
            >
              <span 
                v-if="isAdding(product.id)" 
                class="btn-content"
              >
                <span class="btn-spinner"></span>
              </span>
              <span 
                v-else-if="isAdded(product.id)" 
                class="btn-content"
              >
                <span class="btn-check">✓</span>
              </span>
              <span 
                v-else 
                class="btn-content"
              >
                <span class="btn-plus">+</span>
              </span>
            </button>
            
            <div 
              v-if="product.stock <= 0" 
              class="out-of-stock"
            >
              暂时缺货
            </div>
            
            <div 
              v-else-if="product.stock <= 10 && product.stock > 0" 
              class="stock-warning"
            >
              仅剩{{ product.stock }}件
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div 
      v-if="showToast" 
      class="toast-notification"
      :class="{ 'show': showToast }"
    >
      <div class="toast-icon">{{ toastIcon }}</div>
      <div class="toast-message">{{ toastMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { Product } from '@/types'
import { formatPrice, calculateDiscount, createLock, type Lock } from '@/utils'

interface Props {
  products: Product[]
}

interface Emits {
  (e: 'add-to-cart', product: Product): void
  (e: 'add-success', product: Product): void
  (e: 'add-error', product: Product, error: Error): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const addingProductIds = ref<Set<string>>(new Set())
const addedProductIds = ref<Set<string>>(new Set())
const productLocks = ref<Map<string, Lock>>(new Map())
const imageLoadingStates = ref<Map<string, boolean>>(new Map())

const showToast = ref(false)
const toastMessage = ref('')
const toastIcon = ref('✓')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const getProductLock = (productId: string): Lock => {
  if (!productLocks.value.has(productId)) {
    productLocks.value.set(productId, createLock())
  }
  return productLocks.value.get(productId)!
}

const isAdding = (productId: string): boolean => {
  return addingProductIds.value.has(productId)
}

const isAdded = (productId: string): boolean => {
  return addedProductIds.value.has(productId)
}

const isImageLoading = (productId: string): boolean => {
  return imageLoadingStates.value.get(productId) ?? false
}

const isButtonDisabled = (product: Product): boolean => {
  return (
    product.stock <= 0 || 
    isAdding(product.id) || 
    isAdded(product.id)
  )
}

const showSuccessToast = (message: string) => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  
  toastIcon.value = '✓'
  toastMessage.value = message
  showToast.value = true
  
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const showErrorToast = (message: string) => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  
  toastIcon.value = '✗'
  toastMessage.value = message
  showToast.value = true
  
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const handleAddToCart = async (product: Product) => {
  if (product.stock <= 0) {
    showErrorToast('商品暂时缺货')
    return
  }
  
  const lock = getProductLock(product.id)
  
  if (!lock.tryLock()) {
    showErrorToast('正在处理中，请稍候...')
    return
  }
  
  try {
    addingProductIds.value.add(product.id)
    
    emit('add-to-cart', product)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addedProductIds.value.add(product.id)
    emit('add-success', product)
    
    showSuccessToast(`${product.name.slice(0, 10)}... 已加入购物车`)
    
    setTimeout(() => {
      addedProductIds.value.delete(product.id)
    }, 2000)
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error('未知错误')
    emit('add-error', product, err)
    showErrorToast('加入购物车失败，请重试')
    
  } finally {
    addingProductIds.value.delete(product.id)
    lock.unlock()
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://picsum.photos/200/200'
  target.classList.remove('loading')
  
  const productId = target.getAttribute('data-product-id')
  if (productId) {
    imageLoadingStates.value.set(productId, false)
  }
}

onUnmounted(() => {
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
})
</script>

<style scoped>
.recommend-panel {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.panel-subtitle {
  font-size: 13px;
  color: #999;
}

.empty-recommend {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 15px;
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.recommend-item {
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  position: relative;
}

.recommend-item:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.recommend-item.adding {
  border-color: #007bff;
  background: #f0f7ff;
}

.recommend-item.added {
  border-color: #52c41a;
  background: #f6ffed;
}

.product-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image img.loading {
  opacity: 0.5;
}

.recommend-item:hover .product-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: linear-gradient(135deg, #e63946 0%, #d62828 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 10;
}

.adding-overlay,
.added-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  backdrop-filter: blur(4px);
}

.adding-overlay {
  background: rgba(0, 123, 255, 0.1);
}

.added-overlay {
  background: rgba(82, 196, 26, 0.1);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 123, 255, 0.3);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.adding-text,
.added-text {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
}

.adding-text {
  color: #007bff;
}

.added-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.added-text {
  color: #52c41a;
}

.product-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #999;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #e63946;
}

.original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.product-action {
  padding: 12px;
  padding-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.add-btn:hover:not(.disabled):not(.adding):not(.added) {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}

.add-btn:active:not(.disabled):not(.adding):not(.added) {
  transform: scale(0.95);
}

.add-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.add-btn.adding {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  cursor: wait;
}

.add-btn.added {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  cursor: default;
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.btn-plus {
  margin-top: -2px;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-check {
  font-size: 16px;
  font-weight: bold;
}

.out-of-stock {
  font-size: 12px;
  color: #999;
}

.stock-warning {
  font-size: 12px;
  color: #ff6b00;
  background: #fff7e6;
  padding: 2px 6px;
  border-radius: 4px;
}

.toast-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2000;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.toast-notification.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.toast-notification.show.error .toast-icon {
  background: #e63946;
}

.toast-message {
  font-size: 14px;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .recommend-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 4px;
  }
  
  .product-image {
    height: 140px;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .product-action {
    padding: 10px;
    padding-top: 0;
  }
}

@media (max-width: 480px) {
  .recommend-list {
    grid-template-columns: 1fr;
  }
  
  .toast-notification {
    width: calc(100% - 32px);
    max-width: 300px;
  }
}
</style>
