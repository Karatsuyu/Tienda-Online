import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, StarHalf } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-gray-300" />
      ))}
    </div>
  );
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <Link href={`/product/${product.slug}`} className="block h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square w-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              data-ai-hint={product.imageHint}
            />
            {product.compareAtPrice && (
                <Badge variant="destructive" className="absolute top-2 left-2">
                    - {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </Badge>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-headline font-semibold text-base leading-tight truncate-2-lines flex-grow">
              {product.title}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                {product.compareAtPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
             <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                {renderStars(product.rating)}
                <span>({product.reviews})</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
