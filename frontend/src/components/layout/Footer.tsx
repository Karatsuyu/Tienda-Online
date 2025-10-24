import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    'Acerca de Nosotros': ['Acerca de Mi Tienda', 'Empleos', 'Prensa'],
    'Servicio al Cliente': ['Contáctanos', 'Información de Envío', 'Devoluciones e Intercambios'],
    'Mi Cuenta': ['Historial de Órdenes', 'Rastrear Pedido', 'Configuración de Cuenta'],
  };

  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
                <Package className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold font-headline">Mi Tienda</span>
            </Link>
            <p className="text-muted-foreground font-body">Tu tienda única para todo.</p>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-headline font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-body">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-headline font-semibold mb-4">Suscribirse a nuestro Boletín</h4>
            <p className="text-muted-foreground mb-4 font-body">Obtén las últimas ofertas y actualizaciones directamente en tu bandeja de entrada.</p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-background" />
              <Button type="submit" className="bg-primary hover:bg-primary/90">Suscribirse</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-muted-foreground font-body">
          <p>&copy; {new Date().getFullYear()} Mi Tienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
