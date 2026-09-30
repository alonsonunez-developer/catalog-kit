import type { CatalogDataInput } from '../src'

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`

export const mockData: Record<string, CatalogDataInput> = {
  joyeria: {
    currency: 'MXN',
    categories: [
      { id: 'anillos', name: 'Anillos' },
      { id: 'collares', name: 'Collares' },
      { id: 'aretes', name: 'Aretes' },
    ],
    products: [
      { id: 'j1', name: 'Anillo Solitario', price: 4800, categoryId: 'anillos', image: img('anillo1'), description: 'Oro de 14k con zirconia.' },
      { id: 'j2', name: 'Anillo Eternidad', price: 6200, categoryId: 'anillos', image: img('anillo2'), description: 'Plata 925 bañada en oro.' },
      { id: 'j3', name: 'Collar Perla', price: 3500, categoryId: 'collares', image: img('collar1'), description: 'Perla de agua dulce.' },
      { id: 'j4', name: 'Collar Gota', price: 2900, categoryId: 'collares', image: img('collar2'), description: 'Dije en forma de gota.' },
      { id: 'j5', name: 'Aretes Aro', price: 1800, categoryId: 'aretes', image: img('aretes1'), description: 'Aro clásico de 25 mm.' },
      { id: 'j6', name: 'Aretes Cristal', price: 2100, categoryId: 'aretes', image: img('aretes2'), description: 'Cristal facetado.' },
      { id: 'j7', name: 'Anillo Trenzado', price: 3900, categoryId: 'anillos', image: img('anillo3'), description: 'Diseño trenzado artesanal.' },
      { id: 'j8', name: 'Collar Cadena', price: 4200, categoryId: 'collares', image: img('collar3'), description: 'Cadena fina de 45 cm.' },
    ],
  },
  pasteleria: {
    currency: 'MXN',
    categories: [
      { id: 'pasteles', name: 'Pasteles' },
      { id: 'cupcakes', name: 'Cupcakes' },
      { id: 'galletas', name: 'Galletas' },
    ],
    products: [
      { id: 'p1', name: 'Pastel de Fresa', price: 450, categoryId: 'pasteles', image: img('pastel1'), description: 'Bizcocho vainilla y crema.' },
      { id: 'p2', name: 'Pastel de Chocolate', price: 480, categoryId: 'pasteles', image: img('pastel2'), description: 'Tres capas con ganache.' },
      { id: 'p3', name: 'Cupcake Vainilla', price: 45, categoryId: 'cupcakes', image: img('cupcake1'), description: 'Con betún de mantequilla.' },
      { id: 'p4', name: 'Cupcake Red Velvet', price: 55, categoryId: 'cupcakes', image: img('cupcake2'), description: 'Queso crema y migajas.' },
      { id: 'p5', name: 'Galletas de Avena', price: 90, categoryId: 'galletas', image: img('galleta1'), description: 'Media docena.' },
      { id: 'p6', name: 'Galletas Decoradas', price: 150, categoryId: 'galletas', image: img('galleta2'), description: 'Personalizadas, media docena.' },
      { id: 'p7', name: 'Pastel Tres Leches', price: 420, categoryId: 'pasteles', image: img('pastel3'), description: 'Clásico bañado en leche.' },
      { id: 'p8', name: 'Cupcake Limón', price: 50, categoryId: 'cupcakes', image: img('cupcake3'), description: 'Con glaseado de limón.' },
    ],
  },
}