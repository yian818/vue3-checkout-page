<template>
  <div class="product-list">
    <div class="product-list-header">
      <h2>购物车商品</h2>
      <span class="item-count">共 {{ cartItems.length }} 件商品</span>
    </div>
    
    <div 
      v-if="cartItems.length === 0" 
      class="empty-cart"
    >
      <p>购物车是空的</p>
    </div>
    
    <div 
      v-else
      class="product-items"
    >
      <div 
        v-for="item in cartItems" 
        :key="item.product.id"
        class="product-item"
        :class="{ selected: item.selected }"
      >
        <div class="product-select">
          <input 
            type="checkbox" 
            :checked="item.selected"
            @change="handleToggleSelection(item.product.id)"
            class="checkbox"
          >
        </div>
        
        <div class="product-image">
          <img 
            :src="item.product.image" 
            :alt="item.product.name"
            @error="handleImageError($event)"
          >
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ item.product.name }}</h3>
          <p class="product-desc">{{ item.product.description }}</p>
          <div class="product-price">
            <span class="current-price">{{ formatPrice(item.product.price) }}</span>
            <span 
              v-if="item.product.originalPrice" 
              class="original-price"
            >
              {{ formatPrice(item.product.originalPrice) }}
            </span>
            <span 
              v-if="item.product.originalPrice" 
              class="discount-tag"
            >
              -{{ calculateDiscount(item.product.originalPrice, item.product.price) }}%
            </span>
          </div>
        </div>
        
        <div class="product-quantity">
          <button 
            class="quantity-btn"
            @click="handleDecrease(item)"
            :disabled="item.quantity <= 1"
          >
            -
          </button>
          <span class="quantity-value">{{ item.quantity }}</span>
          <button 
            class="quantity-btn"
            @click="handleIncrease(item)"
            :disabled="item.quantity >= item.product.stock"
          >
            +
          </button>
        </div>
        
        <div class="product-subtotal">
          <span class="subtotal-label">小计：</span>
          <span class="subtotal-price">
            {{ formatPrice(calculateItemTotal(item.product.price, item.quantity)) }}
          </span>
        </div>
        
        <div class="product-actions">
          <button 
            class="delete-btn"
            @click="handleDelete(item.product.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '@/types'
import { formatPrice, calculateDiscount, calculateItemTotal } from '@/utils'

interface Props {
  cartItems: CartItem[]
}

interface Emits {
  (e: 'toggle-selection', productId: string): void
  (e: 'update-quantity', productId: string, quantity: number): void
  (e: 'remove-item', productId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleToggleSelection = (productId: string) => {
  emit('toggle-selection', productId)
}

const handleUpdateQuantity = (productId: string, quantity: number) => {
  emit('update-quantity', productId, quantity)
}

const handleDecrease = (item: CartItem) => {
  if (item.quantity > 1) {
    handleUpdateQuantity(item.product.id, item.quantity - 1)
  }
}

const handleIncrease = (item: CartItem) => {
  if (item.quantity < item.product.stock) {
    handleUpdateQuantity(item.product.id, item.quantity + 1)
  }
}

const handleDelete = (productId: string) => {
  emit('remove-item', productId)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://picsum.photos/200/200'
}
</script>

<style scoped>
.product-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}

.product-list-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.item-count {
  font-size: 14px;
  color: #999;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.product-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.product-item.selected {
  border-color: #007bff;
  background: #f8f9ff;
}

.product-select {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.product-image {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #e63946;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount-tag {
  font-size: 12px;
  color: #e63946;
  background: #fff1f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #007bff;
  color: #007bff;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  width: 40px;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
}

.product-subtotal {
  text-align: right;
  min-width: 120px;
}

.subtotal-label {
  font-size: 13px;
  color: #666;
}

.subtotal-price {
  font-size: 18px;
  font-weight: 600;
  color: #e63946;
  display: block;
  margin-top: 4px;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.delete-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
  border-radius: 4px;
}

.delete-btn:hover {
  color: #e63946;
  background: #fff1f0;
}

@media (max-width: 768px) {
  .product-item {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .product-info {
    width: calc(100% - 134px);
  }
  
  .product-quantity {
    order: 1;
    width: 100%;
    justify-content: space-between;
  }
  
  .product-subtotal {
    order: 2;
    text-align: left;
    min-width: auto;
  }
  
  .product-actions {
    order: 3;
    flex-direction: row;
  }
}
</style>
