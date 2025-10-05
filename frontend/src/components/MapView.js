import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { MapPin, Layers, Navigation, Filter, Crosshair, Loader2 } from 'lucide-react';
import { useMapData } from '../hooks/useMapData';
import { useCategories } from '../hooks/useCategories';
import { useGeolocation } from '../hooks/useGeolocation';
import { useBusinessesNearby } from '../hooks/useBusinessesNearby';
import BusinessMapPin from './BusinessMapPin';
import * as LucideIcons from 'lucide-react';

const MapView = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  
  const { pins: mapPins, loading: pinsLoading } = useMapData({ category: selectedCategory });
  const { categories, loading: categoriesLoading } = useCategories();
  const { location, loading: locationLoading, error: locationError, getLocation } = useGeolocation();
  const { businesses: nearbyBusinesses, loading: nearbyLoading } = useBusinessesNearby(location, 10);
  const { toast } = useToast();

  const handleCategoryFilter = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    setSelectedPin(null);
  };

  const handleLocateMe = async () => {
    try {
      const userLocation = await getLocation();
      
      if (userLocation) {
        setShowNearbyOnly(true);
        setSelectedPin(null);
        
        toast({
          title: "¡Ubicación encontrada!",
          description: `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`,
        });
      }
    } catch (error) {
      // Fallback to default location for demo purposes
      const defaultLocation = { lat: 22.2354, lng: -97.8606 };
      setShowNearbyOnly(true);
      
      toast({
        title: "Ubicación simulada",
        description: "Usando ubicación de Tampico para la demo",
        variant: "default"
      });
    }
  };

  const handlePinClick = (business, category) => {
    setSelectedPin({ business, category });
  };

  const handlePinClose = () => {
    setSelectedPin(null);
  };

  // Determine which businesses to show
  const displayBusinesses = showNearbyOnly && location ? nearbyBusinesses : [];
  const filteredPins = selectedCategory 
    ? mapPins.filter(pin => pin.category === selectedCategory)
    : mapPins;

  return (
    <section data-section="map" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full mb-4">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2" />
            <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
              Explora visualmente
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Mapa de{' '}
            <span className="text-teal-600 dark:text-teal-400 font-bold">
              negocios
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Encuentra negocios cerca de ti con nuestra vista de mapa interactiva
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <Filter className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Location Button */}
                <Button
                  onClick={handleLocateMe}
                  disabled={locationLoading}
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {locationLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Crosshair className="h-4 w-4 mr-2" />
                  )}
                  {locationLoading ? 'Ubicando...' : 'Ubicarme'}
                </Button>

                {/* Show nearby toggle */}
                {location && (
                  <Button
                    variant={showNearbyOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setShowNearbyOnly(!showNearbyOnly);
                      setSelectedPin(null);
                    }}
                    className="w-full justify-start text-xs"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {showNearbyOnly ? 'Mostrar todos' : 'Solo cercanos'}
                  </Button>
                )}

                <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                  <Button
                    variant={selectedCategory === null ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full justify-start ${
                      selectedCategory === null 
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Todas las categorías
                  </Button>
                </div>
                
                {categories.slice(0, 6).map((category) => {
                  const IconComponent = LucideIcons[category.icon] || LucideIcons.Package;
                  const isSelected = selectedCategory === category.name;
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleCategoryFilter(category.name)}
                      className={`w-full justify-start ${
                        isSelected 
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="relative h-full">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900">
                  {/* Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-12 grid-rows-12 h-full">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className="border border-slate-400 dark:border-slate-600"></div>
                      ))}
                    </div>
                  </div>

                  {/* Mock Streets */}
                  <div className="absolute top-1/4 left-0 right-0 h-2 bg-slate-400 dark:bg-slate-600 opacity-60"></div>
                  <div className="absolute top-3/4 left-0 right-0 h-2 bg-slate-400 dark:bg-slate-600 opacity-60"></div>
                  <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-slate-400 dark:bg-slate-600 opacity-60"></div>
                  <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-slate-400 dark:bg-slate-600 opacity-60"></div>

                  {/* City Labels */}
                  <div className="absolute top-8 left-8">
                    <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-lg">
                      Tampico
                    </Badge>
                  </div>
                  <div className="absolute top-1/3 right-8">
                    <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-lg">
                      Cd. Madero
                    </Badge>
                  </div>
                  <div className="absolute bottom-8 left-1/3">
                    <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 shadow-lg">
                      Altamira
                    </Badge>
                  </div>

                  {/* User Location Pin */}
                  {location && (
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{
                        left: '50%',
                        top: '45%',
                      }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                        <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      <Badge className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs">
                        Tu ubicación
                      </Badge>
                    </div>
                  )}

                  {/* Show nearby businesses if location is available */}
                  {showNearbyOnly && location && displayBusinesses.map((business, index) => {
                    const category = categories.find(cat => cat.name === business.category);
                    
                    return (
                      <div
                        key={`nearby-${business.id}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${45 + (index * 8)}%`,
                          top: `${30 + (index * 10)}%`,
                        }}
                      >
                        <BusinessMapPin
                          business={business}
                          category={category}
                          isSelected={selectedPin?.business?.id === business.id}
                          onClick={() => handlePinClick(business, category)}
                          onClose={handlePinClose}
                          userLocation={location}
                        />
                      </div>
                    );
                  })}

                  {/* Show regular map pins if not showing nearby only */}
                  {!showNearbyOnly && filteredPins.map((pin, index) => {
                    const category = categories.find(cat => cat.name === pin.category);
                    const IconComponent = category ? LucideIcons[category.icon] || MapPin : MapPin;
                    
                    return (
                      <div
                        key={pin.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125`}
                        style={{
                          left: `${20 + (index * 15)}%`,
                          top: `${25 + (index * 12)}%`,
                        }}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 hover:from-teal-600 hover:to-cyan-600 transition-colors duration-300">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0 border-2 border-white dark:border-slate-800">
                            {pin.count}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                    {showNearbyOnly && location ? 'Negocios Cercanos' : 'Leyenda'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {showNearbyOnly && location ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-slate-700 dark:text-slate-300">Tu ubicación</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                          <span className="text-slate-700 dark:text-slate-300">
                            {displayBusinesses.length} negocios en 10km
                          </span>
                        </div>
                        {locationError && (
                          <div className="text-red-500 dark:text-red-400 text-xs">
                            {locationError}
                          </div>
                        )}
                      </>
                    ) : (
                      filteredPins.map((pin) => (
                        <div key={pin.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                          <span className="text-slate-700 dark:text-slate-300">
                            {pin.category}: {pin.count} lugares
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Map Actions */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
                Abrir en Google Maps
              </Button>
              <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                Obtener direcciones
              </Button>
              <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                Compartir ubicación
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapView;