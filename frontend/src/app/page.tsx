import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from '@/components/ProductCard';
import { categories, heroSlides } from '@/lib/data';
import { ArrowRight, Gift, Percent, Star } from 'lucide-react';
import { productsAPI } from '@/lib/api';

async function getProducts() {
  try {
    const products = await productsAPI.getAll(0, 16);
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const allProducts: any[] = await getProducts();
  const topDeals = allProducts.slice(0, 8);
  const recommended = allProducts.slice(8, 16);

  return (
    <div className="space-y-12">
      <section className="w-full">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="relative h-[300px] md:h-[500px] w-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.imageHint}
                    priority={slide.id === 1}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                    <h1 className="text-3xl md:text-5xl font-headline font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 max-w-2xl font-body">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                      asChild
                    >
                      <Link href={slide.link}>
                        {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none" />
        </Carousel>
      </section>

      <div className="container mx-auto px-4">
        <section className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="flex items-center p-4 bg-card hover:shadow-lg transition-shadow">
              <Gift className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="font-headline font-semibold">Regalos para Nuevos Usuarios</h3>
                <p className="text-muted-foreground font-body">¡Reclama tus ofertas exclusivas de bienvenida!</p>
              </div>
            </Card>
            <Card className="flex items-center p-4 bg-card hover:shadow-lg transition-shadow">
              <Percent className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="font-headline font-semibold">Grandes Descuentos</h3>
                <p className="text-muted-foreground font-body">Hasta 90% de descuento en artículos seleccionados.</p>
              </div>
            </Card>
            <Card className="flex items-center p-4 bg-card hover:shadow-lg transition-shadow">
              <Star className="h-10 w-10 text-primary mr-4" />
              <div>
                <h3 className="font-headline font-semibold">Productos Mejor Calificados</h3>
                <p className="text-muted-foreground font-body">Compra de nuestros más vendidos.</p>
              </div>
            </Card>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">
            Compra por Categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.id}>
                <Card className="group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={category.imageHint}
                      />
                    </div>
                    <p className="font-headline text-center font-semibold p-3 bg-card">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">
            Principales Ofertas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-4 md:gap-6">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/products">
                Ver Todas las Ofertas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-8 bg-secondary -mx-4 px-4 rounded-lg">
          <h2 className="text-3xl font-headline font-bold text-center mb-12">
            Recomendado para Ti
          </h2>
          
          {/* Carrusel de Categorías */}
          <div className="mb-12">
            <Carousel
              opts={{
                align: 'start',
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="gap-3">
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                    <Link href={`/category/${category.slug}`}>
                      <button className="w-full px-4 py-2 rounded-full border-2 border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200 font-body text-sm font-medium whitespace-nowrap">
                        {category.name}
                      </button>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-4 md:gap-6">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
