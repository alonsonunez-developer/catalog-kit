import { describe, expect, it } from 'vitest'
import { PageSchema, ThemeSchema } from '../src/schema'
import {
  baseThemeName,
  contrastRatio,
  customizeTheme,
  fontOptions,
  radiusOptions,
  readableOn,
  themes,
  resolveTheme,
} from '../src/themes'

describe('temas personalizados', () => {
  it('los temas predefinidos cumplen el schema', () => {
    for (const t of Object.values(themes)) expect(ThemeSchema.safeParse(t).success, t.name).toBe(true)
  })

  it('las opciones de fuente y de bordes son válidas para el schema', () => {
    for (const f of fontOptions) {
      const t = { ...themes.joyeria, fonts: { heading: f.value, body: f.value } }
      expect(ThemeSchema.safeParse(t).success, f.label).toBe(true)
    }
    for (const r of radiusOptions) {
      expect(ThemeSchema.safeParse({ ...themes.joyeria, radius: r.value }).success, r.label).toBe(true)
    }
  })

  it('rechaza colores que no son #rrggbb y fuentes con caracteres peligrosos', () => {
    expect(ThemeSchema.safeParse({ ...themes.joyeria, colors: { ...themes.joyeria.colors, primary: 'red' } }).success).toBe(false)
    expect(
      ThemeSchema.safeParse({ ...themes.joyeria, fonts: { heading: 'x; background: url(a)', body: 'Inter' } }).success,
    ).toBe(false)
  })

  it('customizeTheme no modifica el tema base y marca el nombre', () => {
    const copy = customizeTheme(themes.joyeria, { colors: { primary: '#cc0000' } })
    expect(copy.name).toBe('joyeria-custom')
    expect(copy.colors.primary).toBe('#cc0000')
    expect(themes.joyeria.colors.primary).toBe('#c9a227')
    expect(customizeTheme(copy, { radius: '0.5rem' }).name).toBe('joyeria-custom')
  })

  it('al cambiar el color principal, el texto del botón se vuelve legible', () => {
    expect(customizeTheme(themes.joyeria, { colors: { primary: '#ffffff' } }).colors.onPrimary).toBe('#111111')
    expect(customizeTheme(themes.joyeria, { colors: { primary: '#222222' } }).colors.onPrimary).toBe('#ffffff')
  })

  it('calcula contraste y color legible', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5)
    expect(readableOn('#000000')).toBe('#ffffff')
    expect(readableOn('#ffffff')).toBe('#111111')
  })

  it('baseThemeName recupera el predefinido de origen', () => {
    expect(baseThemeName('pasteleria')).toBe('pasteleria')
    expect(baseThemeName(customizeTheme(themes.pasteleria, { radius: '0rem' }))).toBe('pasteleria')
    expect(baseThemeName('inventado')).toBe('joyeria')
  })

  it('un catálogo acepta un tema completo y rechaza uno inválido', () => {
    const ok = PageSchema.safeParse({ version: 2, theme: customizeTheme(themes.joyeria, { colors: { primary: '#cc0000' } }), pages: [] })
    expect(ok.success).toBe(true)
    const bad = PageSchema.safeParse({ version: 2, theme: { name: 'x' }, pages: [] })
    expect(bad.success).toBe(false)
  })

  it('"brand" usa el tema del negocio y, sin él, cae a joyería', () => {
    const brand = customizeTheme(themes.pasteleria, { colors: { primary: '#cc0000' } })
    expect(resolveTheme('brand', brand).colors.primary).toBe('#cc0000')
    expect(resolveTheme('brand').name).toBe('joyeria')
    expect(resolveTheme('brand', null).name).toBe('joyeria')
    expect(resolveTheme('pasteleria', brand).name).toBe('pasteleria')
  })
})