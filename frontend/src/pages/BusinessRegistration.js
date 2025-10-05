import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Building, ArrowLeft, MapPin, Phone, Mail, Globe, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

const BusinessRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    street: '',
    neighborhood: '',
    city: 'Tampico',
    priceRange: '$$',
    services: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const cities = ['Tampico', 'Ciudad Madero', 'Altamira'];
  const priceRanges = [
    { value: '$', label: '$ - Económico' },
    { value: '$$', label: '$$ - Moderado' },
    { value: '$$$', label: '$$$ - Caro' },
    { value: '$$$$', label: '$$$$ - Premium' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "¡Negocio registrado!",
        description: "Tu negocio ha sido enviado para revisión. Te contactaremos pronto.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        phone: '',
        whatsapp: '',
        email: '',
        website: '',
        street: '',
        neighborhood: '',
        city: 'Tampico',
        priceRange: '$$',
        services: ''
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el negocio. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Asteria <span className="text-teal-600 dark:text-teal-400">Local</span>
                </h1>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
              Registra tu Negocio
            </CardTitle>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Únete a más de 1,200 negocios que confían en Asteria Local
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Información Básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Nombre del Negocio *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ej: Restaurante El Huasteco"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select onValueChange={(value) => handleSelectChange('category', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priceRange">Rango de Precios</Label>
                    <Select onValueChange={(value) => handleSelectChange('priceRange', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="$$" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe tu negocio, servicios y lo que te hace especial..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="services">Servicios Especiales</Label>
                    <Input
                      id="services"
                      name="services"
                      placeholder="Ej: Delivery, Pet Friendly, WiFi, Estacionamiento (separados por comas)"
                      value={formData.services}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Información de Contacto
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+52 833 123 4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="+52 833 123 4567"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contacto@tunegocio.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Sitio Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="www.tunegocio.com"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                  Ubicación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Dirección *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="street"
                        name="street"
                        placeholder="Ej: Av. Universidad #234"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Colonia/Barrio</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      placeholder="Ej: Centro, Zona Dorada"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Select onValueChange={(value) => handleSelectChange('city', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? "Registrando negocio..." : "Registrar Negocio Gratis"}
                </Button>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                  Al registrar tu negocio aceptas nuestros términos y condiciones. 
                  Tu negocio será revisado antes de ser publicado.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessRegistration;