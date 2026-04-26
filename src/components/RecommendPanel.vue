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
          :class="{ 'adding': addingIds.includes(product.id) }"
        >
          <div class="product-image">
            <img 
              :src="product.image" 
              :alt="product.name"
              @error="handleImageError($event)"
            >
            <div 
              v-if="product.originalPrice && product.originalPrice > product.price"
              class="discount-badge"
            >
              -{{ calculateDiscount(product.originalPrice, product.price) }}%
            </div>
          </div>
          
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-desc">{{ product.description }}</p>
            
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
              :disabled="product.stock <= 0 || addingIds.includes(product.id)"
            >
              <span 
                v-if="addingIds.includes(product.id)" 
                class="adding-text"
              >
                已加入
              </span>
              <span v-else class="add-icon">+</span>
            </button>
            
            <div 
              v-if="product.stock <= 0" 
              class="out-of-stock"
            >
              暂时缺货
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types'
import { formatPrice, calculateDiscount } from '@/utils'

interface Props {
  products: Product[]
}

interface Emits {
  (e: 'add-to-cart', product: Product): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const addingIds = ref<string[]>([])

const handleAddToCart = (product: Product) => {
  if (product.stock <= 0 || addingIds.value.includes(product.id)) return
  
  emit('add-to-cart', product)
  
  addingIds.value.push(product.id)
  
  setTimeout(() => {
    const index = addingIds.value.indexOf(product.id)
    if (index > -1) {
      addingIds.value.splice(index, 1)
    }
  }, 1000)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://picsum.photos/200/200'
}
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
}

.recommend-item:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.recommend-item.adding {
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
}

.add-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
}

.add-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.add-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.recommend-item.adding .add-btn {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
}

.add-icon {
  margin-top: -2px;
}

.adding-text {
  font-size: 10px;
  font-weight: 500;
}

.out-of-stock {
  font-size: 12px;
  color: #999;
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
}
</style>
