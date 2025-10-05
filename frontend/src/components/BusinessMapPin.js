import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, Phone, MessageCircle, Navigation, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistance } from '../utils/geolocation';
import { openInGoogleMaps, getDirections, shareLocation } from '../utils/maps';
import { useToast } from '../hooks/use-toast';
import * as LucideIcons from 'lucide-react';

const BusinessMapPin = ({ 
  business, 
  category, 
  isSelected, 
  onClick, 
  onClose,
  userLocation = null 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const IconComponent = category ? LucideIcons[category.icon] || LucideIcons.MapPin : LucideIcons.MapPin;

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (e, phone) => {
    e.stopPropagation();
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/business/${business.id}`);
  };

  const handleOpenMaps = async (e) => {
    e.stopPropagation();
    const lat = business.address?.coordinates?.lat || business.lat;
    const lng = business.address?.coordinates?.lng || business.lng;
    
    if (lat && lng) {
      openInGoogleMaps(lat, lng, business.name);
      toast({
        title: "Abriendo Google Maps",
        description: `Mostrando ubicación de ${business.name}`,
      });
    } else {
      toast({
        title: "Ubicación no disponible",
        description: "No se pudo obtener la ubicación del negocio",
        variant: "destructive"
      });
    }
  };

  const handleGetDirections = async (e) => {
    e.stopPropagation();
    const lat = business.address?.coordinates?.lat || business.lat;
    const lng = business.address?.coordinates?.lng || business.lng;
    
    if (lat && lng) {
      getDirections(lat, lng, business.name, userLocation);
      toast({
        title: "Obteniendo direcciones",
        description: `Calculando ruta a ${business.name}`,
      });
    } else {
      toast({
        title: "Ubicación no disponible",
        description: "No se pudo obtener la ubicación del negocio",
        variant: "destructive"
      });
    }
  };

  const handleShareLocation = async (e) => {
    e.stopPropagation();
    const lat = business.address?.coordinates?.lat || business.lat;
    const lng = business.address?.coordinates?.lng || business.lng;
    
    if (lat && lng) {
      const address = business.address?.street 
        ? `${business.address.street}, ${business.address.neighborhood || ''}, ${business.address.city}`
        : business.address?.city || '';
        
      const result = await shareLocation(lat, lng, business.name, address);
      
      if (result.success) {
        const message = result.method === 'native' 
          ? 'Ubicación compartida exitosamente'
          : 'Ubicación copiada al portapapeles';
        toast({
          title: "¡Ubicación compartida!",
          description: message,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || 'No se pudo compartir la ubicación',
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Ubicación no disponible",
        description: "No se pudo obtener la ubicación del negocio",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative">
      {/* Map Pin */}
      <div
        onClick={onClick}
        className={`cursor-pointer transition-all duration-300 ${
          isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
        }`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
          isSelected 
            ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
            : 'bg-gradient-to-r from-teal-500 to-cyan-500'
        } transition-all duration-300`}>
          <IconComponent className="h-5 w-5 text-white" />
        </div>
        
        {/* Business count badge */}
        {business.count && business.count > 1 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0 border-2 border-white">
            {business.count}
          </Badge>
        )}
      </div>

      {/* Business Info Popup */}
      {isSelected && business && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-80 z-30">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl">
            <CardContent className="p-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                ×
              </button>

              {/* Business header */}
              <div className="mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {business.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                    {business.category}
                  </Badge>
                  {business.price_range && (
                    <Badge variant="outline" className="text-xs">
                      {business.price_range}
                    </Badge>
                  )}
                </div>

                {/* Rating and distance */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {business.rating_average?.toFixed(1) || '4.5'}
                    </span>
                  </div>
                  {userLocation && business.distance !== undefined && (
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {formatDistance(business.distance)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {business.address && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {business.address.street}
                  {business.address.neighborhood && `, ${business.address.neighborhood}`}
                </p>
              )}

              {/* Services */}
              {business.services && business.services.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {business.services.slice(0, 3).map((service, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-slate-100 dark:bg-slate-700"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2">
                {/* First row - Contact buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {business.phone && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => handleCall(e, business.phone)}
                      className="text-xs py-1 h-8"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                  
                  {business.whatsapp && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => handleWhatsApp(e, business.whatsapp)}
                      className="text-xs py-1 h-8 border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                  )}
                  
                  <Button 
                    size="sm"
                    onClick={handleViewDetails}
                    className="text-xs py-1 h-8 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Ver más
                  </Button>
                </div>
                
                {/* Second row - Map actions */}
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleOpenMaps}
                    className="text-xs py-1 h-7 px-2"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Maps
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleGetDirections}
                    className="text-xs py-1 h-7 px-2"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Ir
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleShareLocation}
                    className="text-xs py-1 h-7 px-2"
                  >
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessMapPin;