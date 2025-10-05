import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { 
  ArrowLeft, Star, Phone, MessageCircle, MapPin, Search, 
  Filter, Grid, List, SlidersHorizontal 
} from 'lucide-react';
import { businessesAPI, categoriesAPI, handleApiError } from '../services/api';
import * as LucideIcons from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const cities = ['all', 'Tampico', 'Ciudad Madero', 'Altamira'];
  const sortOptions = [
    { value: 'rating', label: 'Mejor calificados' },
    { value: 'reviews', label: 'Más reseñas' },
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'newest', label: 'Más recientes' }
  ];

  useEffect(() => {
    fetchCategoryData();
  }, [categorySlug]);

  useEffect(() => {
    applyFilters();
  }, [businesses, searchTerm, selectedCity, sortBy]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch category info
      const categoryResponse = await categoriesAPI.getBySlug(categorySlug);
      setCategory(categoryResponse.data);
      
      // Fetch businesses in this category
      const businessesResponse = await businessesAPI.getByCategory(categoryResponse.data.name, 100);
      setBusinesses(businessesResponse.data);
      
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...businesses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply city filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(business => 
        business.address.city === selectedCity
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_average - a.rating_average;
        case 'reviews':
          return b.total_reviews - a.total_reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
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

  const handleViewDetails = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando {categorySlug}...</p>
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Categoría no encontrada</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = LucideIcons[category.icon] || LucideIcons.Package;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al directorio
        </Button>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mr-4">
              <IconComponent className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {category.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{filteredBusinesses.length} de {businesses.length} negocios</span>
            <span>•</span>
            <span>En Tampico, Madero y Altamira</span>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar negocios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* City Filter */}
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ciudades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {cities.slice(1).map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                >
                  <List className="h-4 w-4 mr-1" />
                  Lista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No se encontraron negocios
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Intenta ajustar los filtros para encontrar más resultados
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
              }}
              variant="outline"
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
          }>
            {filteredBusinesses.map((business) => (
              <Card 
                key={business.id}
                className={`group hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                  viewMode === 'list' ? 'hover:-translate-y-1' : 'hover:-translate-y-2'
                }`}
              >
                {viewMode === 'grid' && business.images && business.images[0] && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img 
                      src={business.images[0]} 
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}

                <CardContent className={viewMode === 'list' ? 'p-6 flex items-center gap-6' : 'p-6'}>
                  {viewMode === 'list' && business.images && business.images[0] && (
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <img 
                        src={business.images[0]} 
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
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
                                i < Math.floor(business.rating_average) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-slate-300 dark:text-slate-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {business.rating_average.toFixed(1)}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          ({business.total_reviews} reseñas)
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {business.address.street}, {business.address.neighborhood && `${business.address.neighborhood}, `}{business.address.city}
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                        {business.description}
                      </p>

                      {/* Services & Price */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{business.price_range}</Badge>
                        {business.services.slice(0, 2).map((service, idx) => (
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
                      {business.phone && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCall(business.phone)}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Llamar
                        </Button>
                      )}
                      
                      {business.whatsapp && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleWhatsApp(business.whatsapp)}
                          className="flex-1 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      )}
                      
                      <Button 
                        size="sm"
                        onClick={() => handleViewDetails(business.id)}
                        className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
                      >
                        Ver más
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;