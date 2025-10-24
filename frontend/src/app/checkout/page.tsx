'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { items: cartItems, total: cartTotal, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const shipping = 5.00;
    const total = cartTotal + shipping;

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="text-center p-12">
                    <h2 className="text-2xl font-semibold mb-4">Se requiere iniciar sesión</h2>
                    <p className="text-muted-foreground mb-6">Por favor inicia sesión para continuar con tu pedido.</p>
                    <Button onClick={() => router.push('/login')}>Ir a Iniciar Sesión</Button>
                </Card>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="text-center p-12">
                    <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
                    <p className="text-muted-foreground mb-6">Agrega artículos a tu carrito antes de pagar.</p>
                    <Button onClick={() => router.push('/')}>Continuar Comprando</Button>
                </Card>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            const order = await ordersAPI.checkout();
            toast({
                title: 'Éxito',
                description: '¡Tu pedido ha sido realizado exitosamente!',
            });
            clearCart();
            router.push(`/`);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Fallo al realizar el pedido. Por favor, intenta de nuevo.',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl lg:text-4xl font-headline font-bold text-center mb-8">Pago</h1>
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Nombre</Label>
                                <p className="text-sm text-muted-foreground">{user?.full_name}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Envío</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">La información de envío será recopilada después de realizar el pedido.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Resumen de Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.product.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.product.imageUrl} alt={item.product.title} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{item.product.title}</p>
                                                <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2">
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
                            </div>
                        </CardContent>
                    </Card>
                    <Button 
                        size="lg" 
                        className="w-full text-lg" 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Procesando...' : 'Realizar Pedido'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
