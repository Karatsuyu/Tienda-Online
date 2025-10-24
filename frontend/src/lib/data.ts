import type { Product, Category, HeroSlide } from '@/lib/types';
import { getImage } from '@/lib/placeholder-images';

export const categories: Category[] = [
  { id: '1', name: "Mujer", slug: 'mujer', imageUrl: getImage('cat1').imageUrl, imageHint: getImage('cat1').imageHint },
  { id: '2', name: 'Hogar y Cocina', slug: 'hogar-cocina', imageUrl: getImage('cat2').imageUrl, imageHint: getImage('cat2').imageHint },
  { id: '3', name: 'Electrónicos', slug: 'electronicos', imageUrl: getImage('cat3').imageUrl, imageHint: getImage('cat3').imageHint },
  { id: '4', name: 'Juguetes y Juegos', slug: 'juguetes-juegos', imageUrl: getImage('cat4').imageUrl, imageHint: getImage('cat4').imageHint },
  { id: '5', name: 'Belleza', slug: 'belleza', imageUrl: getImage('cat5').imageUrl, imageHint: getImage('cat5').imageHint },
  { id: '6', name: 'Deportes', slug: 'deportes', imageUrl: getImage('cat6').imageUrl, imageHint: getImage('cat6').imageHint },
  { id: '7', name: 'Hombre', slug: 'hombre', imageUrl: getImage('cat1').imageUrl, imageHint: getImage('cat1').imageHint },
  { id: '8', name: 'Automóviles', slug: 'automoviles', imageUrl: getImage('cat2').imageUrl, imageHint: getImage('cat2').imageHint },
  { id: '9', name: 'Libros y Medios', slug: 'libros-medios', imageUrl: getImage('cat3').imageUrl, imageHint: getImage('cat3').imageHint },
  { id: '10', name: 'Salud y Bienestar', slug: 'salud-bienestar', imageUrl: getImage('cat4').imageUrl, imageHint: getImage('cat4').imageHint },
];

export const products: Product[] = [
  {
    id: '1',
    slug: 'futuristic-smart-watch',
    title: 'Reloj Inteligente Futurista',
    description: 'Un reloj inteligente elegante y moderno con todas las últimas características.',
    price: 199.99,
    compareAtPrice: 249.99,
    category: 'electronicos',
    rating: 4.5,
    reviews: 120,
    imageUrl: getImage('prod1').imageUrl,
    imageHint: getImage('prod1').imageHint
  },
  {
    id: '2',
    slug: 'noise-cancelling-headphones',
    title: 'Audífonos con Cancelación de Ruido',
    description: 'Sumérgete en el sonido con estos audífonos de alta calidad.',
    price: 149.50,
    category: 'electronicos',
    rating: 4.8,
    reviews: 250,
    imageUrl: getImage('prod2').imageUrl,
    imageHint: getImage('prod2').imageHint
  },
  {
    id: '3',
    slug: 'high-speed-kitchen-blender',
    title: 'Licuadora de Cocina de Alta Velocidad',
    description: 'Perfecta para batidos, sopas y más. Un elemento esencial de la cocina.',
    price: 89.99,
    compareAtPrice: 119.99,
    category: 'hogar-cocina',
    rating: 4.7,
    reviews: 95,
    imageUrl: getImage('prod3').imageUrl,
    imageHint: getImage('prod3').imageHint
  },
  {
    id: '4',
    slug: 'lightweight-running-shoes',
    title: 'Zapatos Deportivos Ligeros',
    description: 'Experimenta comodidad y rendimiento en tu carrera diaria.',
    price: 120.00,
    category: 'deportes',
    rating: 4.6,
    reviews: 180,
    imageUrl: getImage('prod4').imageUrl,
    imageHint: getImage('prod4').imageHint
  },
  {
    id: '5',
    slug: 'organic-skincare-set',
    title: 'Conjunto de Cuidado de la Piel Orgánico',
    description: 'Rejuvenece tu piel con este conjunto de cuidado completamente natural.',
    price: 75.00,
    category: 'belleza',
    rating: 4.9,
    reviews: 310,
    imageUrl: getImage('prod5').imageUrl,
    imageHint: getImage('prod5').imageHint
  },
  {
    id: '6',
    slug: 'pro-yoga-mat',
    title: 'Tapete de Yoga Profesional',
    description: 'Tapete antideslizante y ecológico para tu práctica de yoga.',
    price: 45.00,
    compareAtPrice: 59.99,
    category: 'deportes',
    rating: 4.7,
    reviews: 150,
    imageUrl: getImage('prod6').imageUrl,
    imageHint: getImage('prod6').imageHint
  },
  {
    id: '7',
    slug: '4k-camera-drone',
    title: 'Dron con Cámara 4K',
    description: 'Captura vistas aéreas impresionantes con este dron fácil de volar.',
    price: 499.00,
    category: 'electronicos',
    rating: 4.8,
    reviews: 78,
    imageUrl: getImage('prod7').imageUrl,
    imageHint: getImage('prod7').imageHint
  },
  {
    id: '8',
    slug: 'vintage-leather-backpack',
    title: 'Mochila de Cuero Vintage',
    description: 'Mochila elegante y duradera para trabajo o viajes.',
    price: 110.00,
    category: 'mujer',
    rating: 4.5,
    reviews: 99,
    imageUrl: getImage('prod8').imageUrl,
    imageHint: getImage('prod8').imageHint
  },
   {
    id: '9',
    slug: 'led-desk-lamp',
    title: 'Lámpara de Escritorio LED',
    description: 'Lámpara de escritorio moderna y ajustable con múltiples niveles de brillo.',
    price: 39.99,
    category: 'hogar-cocina',
    rating: 4.6,
    reviews: 210,
    imageUrl: getImage('prod9').imageUrl,
    imageHint: getImage('prod9').imageHint
  },
  {
    id: '10',
    slug: 'ergonomic-gaming-mouse',
    title: 'Ratón Gaming Ergonómico',
    description: 'Ratón gaming de alta precisión para el jugador competitivo.',
    price: 65.00,
    compareAtPrice: 85.00,
    category: 'electronicos',
    rating: 4.8,
    reviews: 450,
    imageUrl: getImage('prod10').imageUrl,
    imageHint: getImage('prod10').imageHint
  },
  {
    id: '11',
    slug: 'automatic-drip-coffee-maker',
    title: 'Cafetera de Goteo Automática',
    description: 'Prepara la taza de café perfecta cada mañana.',
    price: 55.50,
    category: 'hogar-cocina',
    rating: 4.5,
    reviews: 130,
    imageUrl: getImage('prod11').imageUrl,
    imageHint: getImage('prod11').imageHint
  },
  {
    id: '12',
    slug: 'classic-aviator-sunglasses',
    title: 'Gafas de Sol Aviador Clásicas',
    description: 'Estilo atemporal con protección UV.',
    price: 25.00,
    category: 'mujer',
    rating: 4.4,
    reviews: 500,
    imageUrl: getImage('prod12').imageUrl,
    imageHint: getImage('prod12').imageHint
  },
  {
    id: '13',
    slug: 'portable-bluetooth-speaker',
    title: 'Altavoz Bluetooth Portátil',
    description: 'Altavoz compacto con sonido potente y batería de larga duración.',
    price: 49.99,
    category: 'electronicos',
    rating: 4.7,
    reviews: 320,
    imageUrl: getImage('prod13').imageUrl,
    imageHint: getImage('prod13').imageHint
  },
  {
    id: '14',
    slug: 'electric-toothbrush',
    title: 'Cepillo de Dientes Eléctrico',
    description: 'Tecnología de limpieza avanzada para una sonrisa más saludable.',
    price: 79.99,
    category: 'belleza',
    rating: 4.9,
    reviews: 180,
    imageUrl: getImage('prod14').imageUrl,
    imageHint: getImage('prod14').imageHint
  },
  {
    id: '15',
    slug: 'insulated-stainless-steel-water-bottle',
    title: 'Botella de Agua Aislada',
    description: 'Mantiene las bebidas frías por 24 horas o calientes por 12 horas.',
    price: 29.95,
    category: 'deportes',
    rating: 4.8,
    reviews: 600,
    imageUrl: getImage('prod15').imageUrl,
    imageHint: getImage('prod15').imageHint
  },
  {
    id: '16',
    slug: 'bestselling-mystery-novel',
    title: 'Novela de Misterio Más Vendida',
    description: 'Una emocionante historia de suspenso que no podrás soltar.',
    price: 14.99,
    category: 'juguetes-juegos',
    rating: 4.6,
    reviews: 1250,
    imageUrl: getImage('prod16').imageUrl,
    imageHint: getImage('prod16').imageHint
  },
];

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        title: "Ofertas Relámpago, Precios Imbatibles",
        subtitle: "Descubre ahorros increíbles en miles de artículos. ¡Ofertas limitadas diariamente!",
        alt: "Venta emocionante de moda",
        link: "/deals",
        cta: "Comprar Ahora",
        imageUrl: getImage('hero1').imageUrl,
        imageHint: getImage('hero1').imageHint
    },
    {
        id: 2,
        title: "Actualiza tu Tecnología",
        subtitle: "Los últimos gadgets y electrónica están a solo un clic de distancia. Envío gratis en órdenes superiores a $50.",
        alt: "Colección de gadgets electrónicos modernos",
        link: "/category/electronicos",
        cta: "Explorar Electrónicos",
        imageUrl: getImage('hero2').imageUrl,
        imageHint: getImage('hero2').imageHint
    },
    {
        id: 3,
        title: "Transforma tu Hogar",
        subtitle: "Encuentra decoración única y elegante para renovar tu espacio.",
        alt: "Sala de estar bellamente decorada",
        link: "/category/hogar-cocina",
        cta: "Descubrir Hogar",
        imageUrl: getImage('hero3').imageUrl,
        imageHint: getImage('hero3').imageHint
    }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};
