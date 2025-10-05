import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, Phone, MessageCircle, MapPin, Award } from 'lucide-react';
import { useFeaturedBusinesses } from '../hooks/useBusinesses';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const TopBusinesses = () => {
  const { businesses: topBusinesses, loading, error } = useFeaturedBusinesses(5);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
    toast({
      title: "Llamando...",
      description: `Marcando a ${phone}`,
    });
  };

  const handleWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
    toast({
      title: "Abriendo WhatsApp...",
      description: "Te redirigimos a WhatsApp",
    });
  };

  const handleViewMore = (business) => {
    navigate(`/business/${business.id}`);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full mb-4">
              <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Los más valorados
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Top de la{' '}
              <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                semana
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Los negocios más recomendados por nuestra comunidad esta semana
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 h-96"></Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 dark:text-red-400">Error cargando negocios destacados: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full mb-4">
            <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Los más valorados
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Top de la{' '}
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">
              semana
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Los negocios más recomendados por nuestra comunidad esta semana
          </p>
        </div>

        {/* Top Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topBusinesses.map((business, index) => (
            <Card 
              key={business.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                index < 3 ? 'ring-2 ring-yellow-300 dark:ring-yellow-600' : ''
              }`}
            >
              {/* Medal Badge for Top 3 */}
              {business.position <= 3 && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800">
                    <span className="text-lg font-bold text-white">
                      {business.position}
                    </span>
                  </div>
                </div>
              )}

              {/* Business Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Price Badge */}
                <Badge className="absolute top-4 right-4 bg-black/70 text-white border-none">
                  {business.price}
                </Badge>
              </div>

              <CardContent className="p-6">
                {/* Business Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
                    {business.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(business.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-slate-300 dark:text-slate-600'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {business.rating}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      ({business.reviews} reseñas)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.neighborhood}
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {business.services.map((service, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCall(business.phone)}
                    className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Llamar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWhatsApp(business.phone)}
                    className="flex-1 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>

                <Button 
                  className="w-full mt-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white transition-all duration-300"
                  onClick={() => handleViewMore(business)}
                >
                  Ver más detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 transition-colors duration-300"
          >
            Ver todos los negocios destacados
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopBusinesses;