import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Search, Grid3X3 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const AllCategories = () => {
  const { categories, loading, error } = useCategories();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando categorías...</p>
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

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mr-4">
              <Grid3X3 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                Todas las Categorías
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Explora todos los tipos de negocios disponibles
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span>{filteredCategories.length} categorías disponibles</span>
            <span>•</span>
            <span>En Tampico, Madero y Altamira</span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-center"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No se encontraron categorías
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Intenta con un término de búsqueda diferente
            </p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
            >
              Ver todas las categorías
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => {
              const IconComponent = LucideIcons[category.icon] || LucideIcons.Package;
              return (
                <Card 
                  key={`category-${category.id || index}`}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Icon Container */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-10 w-10 text-teal-600 dark:text-teal-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300" />
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    
                    {/* Description */}
                    {category.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    {/* Count Badge */}
                    <Badge 
                      className={`${
                        category.count > 0 
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      } group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-all duration-300`}
                    >
                      {category.count} {category.count === 1 ? 'lugar' : 'lugares'}
                    </Badge>

                    {/* Hover indicator */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 mx-auto bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center">
                        <ArrowLeft className="h-4 w-4 text-white rotate-180" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {categories.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Categorías
              </div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {categories.reduce((total, cat) => total + cat.count, 0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Negocios totales
              </div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                3
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Ciudades
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategories;