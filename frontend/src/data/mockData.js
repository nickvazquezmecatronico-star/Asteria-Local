import { 
  Utensils, Pill, Wrench, Coffee, Heart, 
  ShoppingBag, Car, Scissors, GraduationCap, Home,
  MapPin, Phone, MessageCircle, Star, Award
} from 'lucide-react';

export const categories = [
  { id: 1, name: 'Restaurantes', icon: Utensils, count: 245 },
  { id: 2, name: 'Farmacias', icon: Pill, count: 89 },
  { id: 3, name: 'Ferreterías', icon: Wrench, count: 156 },
  { id: 4, name: 'Cafés', icon: Coffee, count: 78 },
  { id: 5, name: 'Veterinarias', icon: Heart, count: 34 },
  { id: 6, name: 'Tiendas', icon: ShoppingBag, count: 198 },
  { id: 7, name: 'Talleres', icon: Car, count: 112 },
  { id: 8, name: 'Salones', icon: Scissors, count: 67 },
  { id: 9, name: 'Educación', icon: GraduationCap, count: 45 },
  { id: 10, name: 'Inmobiliaria', icon: Home, count: 123 }
];

export const topBusinesses = [
  {
    id: 1,
    name: 'Restaurante El Huasteco',
    rating: 4.8,
    reviews: 324,
    category: 'Restaurante',
    neighborhood: 'Centro Tampico',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center',
    price: '$$$',
    services: ['Delivery', 'Pet Friendly'],
    phone: '+52 833 123 4567',
    position: 1,
    medal: '🥇'
  },
  {
    id: 2,
    name: 'Café Madero',
    rating: 4.7,
    reviews: 198,
    category: 'Café',
    neighborhood: 'Zona Dorada',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop&crop=center',
    price: '$$',
    services: ['WiFi', 'Terraza'],
    phone: '+52 833 234 5678',
    position: 2,
    medal: '🥈'
  },
  {
    id: 3,
    name: 'Farmacia San Rafael',
    rating: 4.6,
    reviews: 156,
    category: 'Farmacia',
    neighborhood: 'Altamira',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=200&fit=crop&crop=center',
    price: '$',
    services: ['24 Horas', 'Delivery'],
    phone: '+52 833 345 6789',
    position: 3,
    medal: '🥉'
  },
  {
    id: 4,
    name: 'Veterinaria Pets Care',
    rating: 4.9,
    reviews: 87,
    category: 'Veterinaria',
    neighborhood: 'Unidad Nacional',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop&crop=center',
    price: '$$',
    services: ['Urgencias', 'Estética'],
    phone: '+52 833 456 7890',
    position: 4,
    medal: ''
  },
  {
    id: 5,
    name: 'Ferretería El Martillo',
    rating: 4.5,
    reviews: 203,
    category: 'Ferretería',
    neighborhood: 'Escolleras',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center',
    price: '$$',
    services: ['Entrega', 'Asesoría'],
    phone: '+52 833 567 8901',
    position: 5,
    medal: ''
  }
];

export const mapPins = [
  { id: 1, category: 'Restaurantes', lat: 22.2354, lng: -97.8606, count: 15 },
  { id: 2, category: 'Farmacias', lat: 22.2486, lng: -97.8642, count: 8 },
  { id: 3, category: 'Cafés', lat: 22.2567, lng: -97.8532, count: 6 },
  { id: 4, category: 'Ferreterías', lat: 22.2298, lng: -97.8734, count: 12 },
  { id: 5, category: 'Veterinarias', lat: 22.2412, lng: -97.8567, count: 4 }
];

export const cities = [
  'Tampico',
  'Ciudad Madero', 
  'Altamira'
];