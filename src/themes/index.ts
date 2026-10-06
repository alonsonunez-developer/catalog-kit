import type { Theme } from '../schema'

export const themes: Record<string, Theme> = {
  joyeria: {
    name: 'joyeria',
    colors: {
      primary: '#c9a227',
      background: '#0b0b0b',
      surface: '#141414',
      text: '#f5f1e8',
      muted: '#a8a08c',
      onPrimary: '#0b0b0b',
    },
    fonts: { heading: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    radius: '0.125rem',
  },
  pasteleria: {
    name: 'pasteleria',
    colors: {
      primary: '#e8788f',
      background: '#fff8f3',
      surface: '#ffeadf',
      text: '#4a2c2a',
      muted: '#9a7b75',
      onPrimary: '#ffffff',
    },
    fonts: { heading: "'Pacifico', cursive", body: "'Nunito', system-ui, sans-serif" },
    radius: '1.25rem',
  },
  deportivo: {
    name: 'deportivo',
    colors: {
      primary: '#b94a1a',
      background: '#f6f6f3',
      surface: '#f1f1ee',
      text: '#171717',
      muted: '#6b6b6b',
      onPrimary: '#ffffff',
    },
    fonts: { heading: "'Manrope', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    radius: '0rem',
  },
  western: {
    name: 'western',
    colors: {
      primary: '#8a5a3b',
      background: '#f3efe7',
      surface: '#e8e1d3',
      text: '#251e19',
      muted: '#675f57',
      onPrimary: '#ffffff',
    },
    fonts: { heading: "'Libre Baskerville', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    radius: '0rem',
  },
}

export function resolveTheme(theme: string | Theme): Theme {
  return typeof theme === 'string' ? (themes[theme] ?? themes.joyeria) : theme
}

export function themeToStyle(t: Theme): Record<string, string> {
  return {
    '--ck-primary': t.colors.primary,
    '--ck-bg': t.colors.background,
    '--ck-surface': t.colors.surface,
    '--ck-text': t.colors.text,
    '--ck-muted': t.colors.muted,
    '--ck-on-primary': t.colors.onPrimary,
    '--ck-font-heading': t.fonts.heading,
    '--ck-font-body': t.fonts.body,
    '--ck-radius': t.radius,
  }
}

// ===== Personalización =====

export const fontOptions = [
  { label: 'Playfair Display (elegante)', value: "'Playfair Display', Georgia, serif" },
  { label: 'Cormorant Garamond (fina, de lujo)', value: "'Cormorant Garamond', Georgia, serif" },
  { label: 'Lora (clásica)', value: "'Lora', Georgia, serif" },
  { label: 'Pacifico (manuscrita)', value: "'Pacifico', cursive" },
  { label: 'Inter (neutra)', value: "'Inter', system-ui, sans-serif" },
  { label: 'Montserrat (moderna)', value: "'Montserrat', system-ui, sans-serif" },
  { label: 'Poppins (redondeada)', value: "'Poppins', system-ui, sans-serif" },
  { label: 'DM Sans (limpia)', value: "'DM Sans', system-ui, sans-serif" },
  { label: 'Nunito (amable)', value: "'Nunito', system-ui, sans-serif" },
  { label: 'Manrope (deportiva, moderna)', value: "'Manrope', system-ui, sans-serif" },
  { label: 'Libre Baskerville (serif western)', value: "'Libre Baskerville', Georgia, serif" },
]

export const radiusOptions = [
  { label: 'Rectos', value: '0rem' },
  { label: 'Casi rectos', value: '0.125rem' },
  { label: 'Suaves', value: '0.5rem' },
  { label: 'Redondeados', value: '1.25rem' },
]

const HEX = /^#[0-9a-fA-F]{6}$/

function luminance(hex: string): number {
  if (!HEX.test(hex)) return 0
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Relación de contraste WCAG (de 1 a 21). 4.5 o más es legible para texto normal.
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Blanco o casi negro, el que mejor se lea sobre ese fondo
export function readableOn(bg: string): string {
  return contrastRatio(bg, '#ffffff') >= contrastRatio(bg, '#111111') ? '#ffffff' : '#111111'
}

// Nombre del tema predefinido del que parte un tema (o un nombre)
export function baseThemeName(theme: string | Theme): string {
  const name = typeof theme === 'string' ? theme : theme.name.replace(/-custom$/, '')
  return name in themes ? name : 'joyeria'
}

// Copia del tema con cambios. Si cambia el color principal, el texto de los botones se ajusta solo.
export function customizeTheme(
  base: Theme,
  patch: { colors?: Partial<Theme['colors']>; fonts?: Partial<Theme['fonts']>; radius?: string },
): Theme {
  const colors = { ...base.colors, ...patch.colors }
  if (patch.colors?.primary && !patch.colors.onPrimary) colors.onPrimary = readableOn(colors.primary)
  return {
    ...base,
    name: base.name.endsWith('-custom') ? base.name : `${base.name}-custom`,
    colors,
    fonts: { ...base.fonts, ...patch.fonts },
    radius: patch.radius ?? base.radius,
  }
}