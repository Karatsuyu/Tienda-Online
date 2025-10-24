export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  imageUrl: string;
  imageHint: string;
  rating: number;
  reviews: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  imageHint: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageHint: string;
  alt: string;
  link: string;
  cta: string;
}
