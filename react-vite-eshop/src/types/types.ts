// src/types/types.ts
export interface Category {
    id: number;
    name: string;
    description?: string;
    Products?: Product[];
    icon?: string;
  }
  
  export interface ProductImage {
    id: number;
    imageUrl: string;
    productId: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string; // Případně `description?: string;` pokud může být undefined
    price: number;
    imageUrl?: string;
    categoryId: number;
    stock: number;
    purchaseCount?: number;
    Category?: Category;
    images?: ProductImage[]; 
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export interface Order {
    id: number;
    userId: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    OrderItems?: OrderItem[];
  }
  
  export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    Product?: Product;
  }

  // src/types/types.ts
export interface Article {
    id: number;
    title: string;
    image: string;
    shortText: string;
    content: string; // Detailní obsah článku
    createdAt: string;
    updatedAt: string;
  }

  export interface Slider {
    id: number;
    image: string;
    caption?: string;
    buttonText?: string;
    buttonLink?: string;
  }  
  
  