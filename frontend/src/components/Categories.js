import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useCategories } from '../hooks/useCategories';
import * as LucideIcons from 'lucide-react';

const Categories = () => {
  const { categories, loading, error } = useCategories();

  const handleCategoryClick = (category) => {
    console.log('Category selected:', category.name);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Explora por{' '}
              <span className="text-teal-600 dark:text-teal-400 font-bold">
                categorías
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Encuentra exactamente lo que necesitas navegando por nuestras categorías más populares
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 h-32"></Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 dark:text-red-400">Error cargando categorías: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section data-section="categories" className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Explora por{' '}
            <span className="text-teal-600 dark:text-teal-400 font-bold">
              categorías
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas navegando por nuestras categorías más populares
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const IconComponent = LucideIcons[category.icon] || LucideIcons.Package;
            return (
              <Card 
                key={category.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600"
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon Container */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-8 w-8 text-teal-600 dark:text-teal-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300" />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {/* Count Badge */}
                  <Badge 
                    variant="secondary" 
                    className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-all duration-300"
                  >
                    {category.count} lugares
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors duration-200 group">
            Ver todas las categorías
            <svg 
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;