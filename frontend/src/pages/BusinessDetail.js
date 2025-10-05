import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  ArrowLeft, Star, Phone, MessageCircle, Globe, MapPin, 
  Clock, Shield, Heart, Share2, Bookmark 
} from 'lucide-react';
import { businessesAPI, handleApiError } from '../services/api';
import ReviewSection from '../components/ReviewSection';

const BusinessDetail = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchBusinessDetail();
  }, [businessId]);

  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessesAPI.getById(businessId);
      setBusiness(response.data);
      
      // Set mock reviews for demo
      setReviews([
        {
          id: '1',
          user_name: 'María González',
          rating: 5,
          comment: 'Excelente servicio y muy buena atención. El lugar está muy limpio y la comida deliciosa. Definitivamente regresaré.',
          created_at: '2024-12-01T10:00:00Z',
          is_verified: true,
          helpful_count: 8
        },
        {
          id: '2',
          user_name: 'Carlos Méndez',
          rating: 4,
          comment: 'Muy buen lugar, la calidad es consistente y los precios justos. El único detalle es que a veces hay que esperar un poco.',
          created_at: '2024-11-28T15:30:00Z',
          is_verified: false,
          helpful_count: 5
        }
      ]);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleWebsite = (website) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Descubre ${business.name} en Asteria Local`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace se ha copiado al portapapeles",
      });
    }
  };

  const handleNewReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    // Update business rating (simple average for demo)
    const newTotal = reviews.length + 1;
    const newAverage = (business.rating_average * business.total_reviews + newReview.rating) / newTotal;
    setBusiness(prev => ({
      ...prev,
      rating_average: newAverage,
      total_reviews: newTotal
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando negocio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Negocio no encontrado</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al directorio
        </Button>

        {/* Main Business Card */}
        <Card className="mb-8 overflow-hidden bg-white dark:bg-slate-800 shadow-2xl">
          {/* Business Image */}
          {business.images && business.images[0] && (
            <div className="h-64 overflow-hidden">
              <img 
                src={business.images[0]} 
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Side - Business Info */}
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {business.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-3">
                      <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                        {business.category}
                      </Badge>
                      <Badge variant="outline">{business.price_range}</Badge>
                      {business.is_verified && (
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          <Shield className="h-3 w-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(business.rating_average) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-300 dark:text-slate-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {business.rating_average.toFixed(1)}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({business.total_reviews} reseñas)
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {business.description}
                </p>

                {/* Services */}
                {business.services && business.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Servicios</h3>
                    <div className="flex flex-wrap gap-2">
                      {business.services.map((service, idx) => (
                        <Badge 
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Ubicación</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">{business.address.street}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {business.address.neighborhood && `${business.address.neighborhood}, `}
                        {business.address.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Actions */}
              <div className="lg:w-80">
                <Card className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contacto</h3>
                    
                    <div className="space-y-3">
                      {/* Phone */}
                      {business.phone && (
                        <Button 
                          onClick={() => handleCall(business.phone)}
                          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Llamar: {business.phone}
                        </Button>
                      )}

                      {/* WhatsApp */}
                      {business.whatsapp && (
                        <Button 
                          onClick={() => handleWhatsApp(business.whatsapp)}
                          className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          WhatsApp: {business.whatsapp}
                        </Button>
                      )}

                      {/* Website */}
                      {business.website && (
                        <Button 
                          onClick={() => handleWebsite(business.website)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Sitio Web
                        </Button>
                      )}

                      {/* Hours */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Horarios
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Consulta horarios por teléfono
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Reviews Link */}
                <Card className="mt-6">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Reseñas</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                      {business.total_reviews > 0 
                        ? `${business.total_reviews} reseñas de clientes` 
                        : 'Sé el primero en dejar una reseña'
                      }
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        document.getElementById('reviews-section').scrollIntoView({ 
                          behavior: 'smooth' 
                        });
                      }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Ver reseñas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDetail;