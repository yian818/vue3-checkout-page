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

export const recommendedProducts: Product[] = [
  {
    id: '6',
    name: 'AirPods Pro 第二代 USB-C',
    price: 1899,
    originalPrice: 1999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AirPods%20Pro%202nd%20generation%20wireless%20earbuds%20white%20color%20with%20charging%20case%20professional%20product%20photo&image_size=square_hd',
    description: '主动降噪，空间音频，USB-C充电接口',
    stock: 300,
    category: '耳机'
  },
  {
    id: '7',
    name: 'Magic Keyboard 妙控键盘',
    price: 899,
    originalPrice: 999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Apple%20Magic%20Keyboard%20wireless%20keyboard%20white%20color%20professional%20product%20photo&image_size=square_hd',
    description: '无线蓝牙键盘，触控板设计，背光按键',
    stock: 250,
    category: '配件'
  },
  {
    id: '8',
    name: 'Samsung Galaxy S24 Ultra',
    price: 8999,
    originalPrice: 9999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Samsung%20Galaxy%20S24%20Ultra%20smartphone%20titanium%20gray%20color%20professional%20product%20photo&image_size=square_hd',
    description: 'AI智能手机，2亿像素相机，S Pen手写笔',
    stock: 120,
    category: '手机'
  },
  {
    id: '9',
    name: 'DJI Mini 4 Pro 无人机',
    price: 5799,
    originalPrice: 6199,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=DJI%20Mini%204%20Pro%20drone%20quadcopter%20with%20camera%20professional%20product%20photo&image_size=square_hd',
    description: '4K HDR视频，智能跟随，全向避障',
    stock: 80,
    category: '数码'
  },
  {
    id: '10',
    name: 'Logitech MX Master 3S 鼠标',
    price: 799,
    originalPrice: 899,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Logitech%20MX%20Master%203S%20wireless%20mouse%20graphite%20color%20professional%20product%20photo&image_size=square_hd',
    description: '8000 DPI传感器，电磁滚轮，多设备切换',
    stock: 400,
    category: '配件'
  },
  {
    id: '11',
    name: 'Kindle Oasis 电子书阅读器',
    price: 2399,
    originalPrice: 2699,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Amazon%20Kindle%20Oasis%20e-reader%20graphite%20color%20with%20warm%20light%20professional%20product%20photo&image_size=square_hd',
    description: '7英寸超清屏幕，可调节冷暖色温，防水设计',
    stock: 150,
    category: '数码'
  },
  {
    id: '12',
    name: 'Apple TV 4K 128GB',
    price: 1499,
    originalPrice: 1699,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Apple%20TV%204K%20streaming%20device%20black%20color%20with%20Siri%20Remote%20professional%20product%20photo&image_size=square_hd',
    description: 'A15仿生芯片，支持杜比视界，Thread智能家居',
    stock: 200,
    category: '数码'
  },
  {
    id: '13',
    name: 'Bose QuietComfort Ultra 耳机',
    price: 3499,
    originalPrice: 3999,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Bose%20QuietComfort%20Ultra%20wireless%20noise%20cancelling%20headphones%20black%20color%20professional%20product%20photo&image_size=square_hd',
    description: '空间音频技术，世界级降噪，舒适佩戴体验',
    stock: 100,
    category: '耳机'
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
