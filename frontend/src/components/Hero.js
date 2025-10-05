import React from 'react';
import { Button } from './ui/button';
import { MapPin, Search, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-16 h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-teal-200 dark:border-teal-800 mb-8 shadow-lg">
            <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 mr-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tampico • Ciudad Madero • Altamira
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Descubre lo mejor de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-500">
              Tampico, Madero
            </span>{' '}
            y{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 dark:from-cyan-400 dark:via-teal-400 dark:to-cyan-500">
              Altamira
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tu directorio local inteligente. Encuentra los mejores negocios, lee reseñas auténticas 
            y conecta con tu comunidad de manera fácil y rápida.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            <div className="flex items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              <span className="text-slate-700 dark:text-slate-300">+1,200 negocios</span>
            </div>
            <div className="flex items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Star className="h-3 w-3 text-yellow-500 mr-2 fill-current" />
              <span className="text-slate-700 dark:text-slate-300">+5,000 reseñas</span>
            </div>
            <div className="flex items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
              <span className="text-slate-700 dark:text-slate-300">3 ciudades</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2" />
              Explorar negocios
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 text-lg font-medium transition-all duration-300 hover:border-teal-500 dark:hover:border-teal-400"
            >
              Ver en mapa
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">4.8</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Calificación promedio</div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">98%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Satisfacción</div>
            </div>
            <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">24/7</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;