import type { ProductCategory, ProductStatus } from "../enums/product.enum";

/** Mirrors the backend type (k-glow/src/libs/types/product.ts). */
export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productBrand: string;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productDiscount?: number;
  productVolume: string;
  productLeftCount: number;
  productDesc?: string;
  productHowToUse?: string;
  productSuitableFor?: string;
  productImages: string[];
  productViews: number;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  productCategory?: ProductCategory;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productBrand: string;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productDiscount?: number;
  productVolume?: string;
  productLeftCount: number;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}
