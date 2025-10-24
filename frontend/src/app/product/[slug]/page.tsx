'use client';

import { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { productsAPI } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getBySlug(slug) as Product;
        setProduct(data);
        setSelectedImage(data.imageUrl);

        // Fetch related products
        const allProducts = await productsAPI.getAll(0, 100) as Product[];
        const related = (Array.isArray(allProducts) ? allProducts : [])
          .filter((p: Product) => p.id !== data.id)
          .slice(0, 5);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error al obtener producto:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "¡Agregado al carrito!",
        description: `${quantity} x ${product.title} ha sido agregado a tu carrito.`,
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando...</div>;
  }

  if (!product) {
    notFound();
  }

  const otherImages = [
      product.imageUrl,
      'https://picsum.photos/seed/p-sub1/600/600',
      'https://picsum.photos/seed/p-sub2/600/600',
      'https://picsum.photos/seed/p-sub3/600/600',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg mb-4">
            <Image
              src={selectedImage || product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              data-ai-hint={product.imageHint}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {otherImages.map((img, index) => (
                <div key={index} 
                    className={`relative aspect-square cursor-pointer rounded-md overflow-hidden ring-2 ${selectedImage === img ? 'ring-primary' : 'ring-transparent'}`}
                    onClick={() => setSelectedImage(img)}>
                    <Image
                        src={img}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                    />
                </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl lg:text-4xl font-headline font-bold">{product.title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">{product.rating} ({product.reviews} reseñas)</span>
          </div>

          <div>
            <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="ml-4 text-xl text-muted-foreground line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          
          <p className="font-body text-lg text-muted-foreground">{product.description}</p>
          
          <Separator />
          
          <div className="flex items-center gap-4">
            <span className="font-semibold">Cantidad:</span>
            <div className="flex items-center gap-2 rounded-full border p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Agregar al Carrito
          </Button>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                    <h4 className="font-semibold">Envío Gratis</h4>
                    <p className="text-sm text-muted-foreground">En todas las órdenes mayores a $50</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div>
                    <h4 className="font-semibold">Pago Seguro</h4>
                    <p className="text-sm text-muted-foreground">Tu información está protegida.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-headline font-bold text-center mb-8">También te Podría Gustar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {relatedProducts.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
