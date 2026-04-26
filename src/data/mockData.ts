import type { Product, Coupon } from '@/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Apple MacBook Pro 14英寸 M3 Pro芯片',
    price: 14999,
    originalPrice: 16999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MacBook%20Pro%2014%20inch%20laptop%20computer%20silver%20color%20professional%20product%20photo&image_size=square_hd',
    description: 'M3 Pro芯片，18GB内存，512GB固态硬盘',
    stock: 50,
    category: '电脑'
  },
  {
    id: '2',
    name: 'Apple iPhone 15 Pro Max 256GB',
    price: 9999,
    originalPrice: 10999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%2015%20Pro%20Max%20smartphone%20titanium%20blue%20color%20professional%20product%20photo&image_size=square_hd',
    description: 'A17 Pro芯片，钛金属设计，专业级摄像系统',
    stock: 100,
    category: '手机'
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 无线降噪耳机',
    price: 2499,
    originalPrice: 2999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sony%20WH-1000XM5%20wireless%20noise%20cancelling%20headphones%20black%20color%20professional%20product%20photo&image_size=square_hd',
    description: '业界领先降噪，30小时续航，舒适佩戴',
    stock: 200,
    category: '耳机'
  },
  {
    id: '4',
    name: 'Apple Watch Series 9 GPS 45mm',
    price: 3199,
    originalPrice: 3499,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Apple%20Watch%20Series%209%20smart%20watch%20midnight%20aluminum%20case%20professional%20product%20photo&image_size=square_hd',
    description: 'S9芯片，双击手势操作，健康监测',
    stock: 150,
    category: '智能穿戴'
  },
  {
    id: '5',
    name: 'iPad Pro 12.9英寸 M2芯片',
    price: 8499,
    originalPrice: 9299,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPad%20Pro%2012.9%20inch%20tablet%20silver%20color%20with%20Apple%20Pencil%20professional%20product%20photo&image_size=square_hd',
    description: 'M2芯片，Liquid Retina XDR显示屏，支持Apple Pencil悬停',
    stock: 80,
    category: '平板'
  }
]

export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'NEW100',
    discountType: 'fixed',
    discountValue: 100,
    minPurchase: 1000,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    id: '2',
    code: 'VIP10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 5000,
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true
  }
]
