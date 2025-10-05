import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { 
  Star, Send, User, Calendar, ThumbsUp, Flag, 
  Camera, CheckCircle, AlertCircle 
} from 'lucide-react';

const ReviewSection = ({ businessId, reviews = [], averageRating = 0, totalReviews = 0, onNewReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    userName: '',
    userEmail: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.rating) {
      toast({
        title: "Calificación requerida",
        description: "Por favor selecciona una calificación",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast({
        title: "Comentario requerido",
        description: "Por favor escribe un comentario",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.userName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const reviewData = {
        id: Date.now().toString(),
        ...newReview,
        created_at: new Date().toISOString(),
        is_verified: false,
        helpful_count: 0
      };

      // Call parent callback if provided
      if (onNewReview) {
        onNewReview(reviewData);
      }

      toast({
        title: "¡Reseña enviada!",
        description: "Tu reseña ha sido enviada y será revisada pronto",
      });

      // Reset form
      setNewReview({
        rating: 0,
        comment: '',
        userName: '',
        userEmail: ''
      });
      setShowReviewForm(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleHelpful = (reviewId) => {
    toast({
      title: "Gracias por tu feedback",
      description: "Has marcado esta reseña como útil",
    });
  };

  const renderStars = (rating, size = 'sm', interactive = false, onRate = null, hoverValue = 0) => {
    return [...Array(5)].map((_, i) => {
      const filled = hoverValue > 0 ? i < hoverValue : i < rating;
      return (
        <Star 
          key={i}
          className={`${size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} ${
            filled ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
          onClick={interactive ? () => onRate && onRate(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Reseñas y Calificaciones
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                ({totalReviews} reseñas)
              </span>
            </div>
          </div>
        </div>
        
        {!showReviewForm && (
          <Button 
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
          >
            <Star className="h-4 w-4 mr-2" />
            Escribir reseña
          </Button>
        )}
      </div>

      {/* Rating Distribution */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Distribución de calificaciones
              </h4>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-8">
                    {stars}★
                  </span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.random() * 80 + 10}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 w-8">
                    {Math.floor(Math.random() * 50)}
                  </span>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Aspectos destacados
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Calidad del servicio', score: 4.8 },
                  { label: 'Limpieza', score: 4.6 },
                  { label: 'Precio/calidad', score: 4.4 },
                  { label: 'Ubicación', score: 4.7 }
                ].map((aspect) => (
                  <div key={aspect.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {aspect.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {renderStars(aspect.score)}
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {aspect.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card className="border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              Escribe tu reseña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Calificación *
                </label>
                <div className="flex items-center gap-1">
                  {renderStars(
                    newReview.rating, 
                    'lg', 
                    true, 
                    handleRatingClick, 
                    hoverRating
                  )}
                  {newReview.rating > 0 && (
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      {newReview.rating}/5
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tu nombre *
                  </label>
                  <Input
                    value={newReview.userName}
                    onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email (opcional)
                  </label>
                  <Input
                    type="email"
                    value={newReview.userEmail}
                    onChange={(e) => setNewReview(prev => ({ ...prev, userEmail: e.target.value }))}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tu experiencia *
                </label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este negocio..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar reseña
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Star className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No hay reseñas aún
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Sé el primero en compartir tu experiencia
              </p>
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
              >
                Escribir primera reseña
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {review.user_name || review.userName}
                          </span>
                          {review.is_verified && (
                            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                      {review.comment}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                        className="text-slate-500 hover:text-teal-600 dark:hover:text-teal-400"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Útil ({review.helpful_count || 0})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Reviews */}
      {reviews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-slate-300 dark:border-slate-600">
            Ver más reseñas
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;