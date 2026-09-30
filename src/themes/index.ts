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