'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/types';

interface CartItem {
    product: Product;
    quantity: number;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: { item: CartItem, onUpdateQuantity: (id: string, q: number) => void, onRemove: (id: string) => void }) => {
    return (
        <div className="flex items-start gap-4 py-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" />
            </div>
            <div className="flex-grow">
                <Link href={`/product/${item.product.slug}`} className="font-semibold hover:text-primary">{item.product.title}</Link>
                <p className="text-sm text-muted-foreground">Precio: ${item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 rounded-full border">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => onRemove(item.product.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar item</span>
                </Button>
            </div>
        </div>
    );
};


export default function CartPage() {
    const { items: cartItems, updateQuantity, removeFromCart, total: cartTotal } = useCart();
    
    const shipping = 5.00;
    const total = cartTotal + shipping;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl lg:text-4xl font-headline font-bold mb-8">Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <Card className="text-center p-12">
                    <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
                    <p className="text-muted-foreground mb-6">Parece que aún no has agregado nada a tu carrito.</p>
                    <Button asChild>
                        <Link href="/">Continuar Comprando</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{cartItems.length} {cartItems.length === 1 ? 'artículo' : 'artículos'} en tu carrito</CardTitle>
                            </CardHeader>
                            <CardContent className="divide-y">
                                {cartItems.map(item => (
                                    <CartItem key={item.product.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen de Pedido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/checkout">Proceder a Pagar</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
