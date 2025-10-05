import React from 'react';
import { Button } from './ui/button';
import { 
  Facebook, Twitter, Instagram, Mail, Phone, MapPin, 
  Home, Grid3X3, Tag, MessageSquare, Shield, ChevronRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navegacion: [
      { name: 'Inicio', href: '#', icon: Home },
      { name: 'Categorías', href: '#', icon: Grid3X3 },
      { name: 'Promociones', href: '#', icon: Tag },
      { name: 'Contacto', href: '#', icon: MessageSquare }
    ],
    legal: [
      { name: 'Política de privacidad', href: '#', icon: Shield },
      { name: 'Términos de servicio', href: '#' },
      { name: 'Política de cookies', href: '#' },
      { name: 'Ayuda y soporte', href: '#' }
    ],
    categorias: [
      { name: 'Restaurantes', href: '#' },
      { name: 'Farmacias', href: '#' },
      { name: 'Ferreterías', href: '#' },
      { name: 'Cafés', href: '#' },
      { name: 'Veterinarias', href: '#' },
      { name: 'Ver todas', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' }
  ];

  return (
    <footer className="bg-slate-900 dark:bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-teal-900/20 to-slate-900/50"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Asteria Local</h3>
                  <p className="text-xs text-slate-400">Un proyecto de Asteria Tech</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                Tu directorio local inteligente para Tampico, Ciudad Madero y Altamira. 
                Conectamos negocios con clientes de manera fácil y confiable.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">Tampico, Tamaulipas, México</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">contacto@asterialocal.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">+52 833 123 4567</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="sm"
                      className={`p-2 text-slate-400 ${social.color} transition-colors duration-200 hover:bg-slate-800`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="font-semibold text-white mb-6 flex items-center">
                <Home className="h-4 w-4 mr-2 text-teal-400" />
                Navegación
              </h4>
              <ul className="space-y-3">
                {footerLinks.navegacion.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="flex items-center text-slate-300 hover:text-teal-400 transition-colors duration-200 group"
                      >
                        <IconComponent className="h-3 w-3 mr-2 opacity-60 group-hover:opacity-100" />
                        {link.name}
                        <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-white mb-6 flex items-center">
                <Grid3X3 className="h-4 w-4 mr-2 text-teal-400" />
                Categorías populares
              </h4>
              <ul className="space-y-3">
                {footerLinks.categorias.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-slate-300 hover:text-teal-400 transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="font-semibold text-white mb-6 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-teal-400" />
                Legal y soporte
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-slate-300 hover:text-teal-400 transition-colors duration-200 flex items-center group"
                    >
                      {link.name}
                      <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter Signup */}
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h5 className="font-medium text-white mb-2">Newsletter</h5>
                <p className="text-xs text-slate-400 mb-3">Recibe las últimas noticias y promociones</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Mail className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-400 text-center md:text-left">
                © {currentYear} Asteria Local — Un proyecto de{' '}
                <span className="text-teal-400 font-medium">Asteria Tech</span>
              </div>
              
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span>Hecho con ❤️ en Tampico</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Todos los sistemas operativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;