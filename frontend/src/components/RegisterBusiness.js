import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Building, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterBusiness = () => {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/business-registration');
  };

  const benefits = [
    {
      icon: Users,
      title: 'Más clientes',
      description: 'Conecta con miles de usuarios locales que buscan tus servicios'
    },
    {
      icon: TrendingUp,
      title: 'Aumenta ventas',
      description: 'Incrementa tus ingresos con mayor visibilidad online'
    },
    {
      icon: Star,
      title: 'Reseñas auténticas',
      description: 'Construye confianza con reseñas reales de clientes satisfechos'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-cyan-50/30 to-slate-50 dark:from-slate-800 dark:via-teal-900/20 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-full mb-6">
            <Building className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Para negocios
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            ¿Tienes un negocio?{' '}
            <span className="text-teal-600 dark:text-teal-400 font-bold">
              Súmalo a Asteria Local
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Forma parte del directorio local más completo de Tampico, Madero y Altamira. 
            Aumenta tu visibilidad y conecta con más clientes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Beneficios de registrarte
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Únete a más de 1,200 negocios que ya confían en nosotros
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">1,200+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Negocios registrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">50K+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Visitas mensuales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-1">4.8★</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Calificación promedio</div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
            
            <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Registro gratuito
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Crea tu perfil de negocio en minutos. Es completamente gratuito 
                  y podrás empezar a recibir clientes de inmediato.
                </p>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Perfil completo con fotos y descripción</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Sistema de reseñas y calificaciones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Contacto directo con clientes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-slate-700 dark:text-slate-300">Estadísticas y análisis</span>
                  </div>
                </div>

                <Button 
                  size="lg"
                  onClick={handleRegisterClick}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Registrar mi negocio gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                  Sin compromisos • Configuración en 5 minutos • Soporte incluido
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterBusiness;