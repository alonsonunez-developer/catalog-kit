export const sampleCatalog = {
  currency: 'MXN',
  business: {
    name: 'Tu negocio',
    tagline: 'Así se verá tu catálogo',
    whatsapp: '+52 555 000 0000',
    instagram: '@tunegocio',
  },
  attributeDefs: [
    { key: 'color', label: 'Color', type: 'list' as const },
    { key: 'talla', label: 'Tallas', type: 'list' as const },
  ],
  categories: [
    { id: 'ejemplo-a', name: 'Colección A' },
    { id: 'ejemplo-b', name: 'Colección B' },
  ],
  products: Array.from({ length: 12 }, (_, i) => ({
    id: `ejemplo-${i + 1}`,
    name: `Producto ${i + 1}`,
    price: 190 + i * 30,
    description: 'Descripción breve del producto.',
    sku: `EJ-${String(i + 1).padStart(3, '0')}`,
    categoryId: i < 7 ? 'ejemplo-a' : 'ejemplo-b',
    attributes: { color: ['Negro', 'Arena'], talla: ['S', 'M', 'L'] },
  })),
}