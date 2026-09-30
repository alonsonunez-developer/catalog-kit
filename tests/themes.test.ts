import { describe, expect, it } from 'vitest'
import { resolveTheme, themeToStyle, themes } from '../src/themes'

describe('temas', () => {
  it('resuelve por nombre y cae a joyería si no existe', () => {
    expect(resolveTheme('pasteleria').name).toBe('pasteleria')
    expect(resolveTheme('inexistente').name).toBe('joyeria')
  })

  it('acepta un tema personalizado completo', () => {
    expect(resolveTheme({ ...themes.joyeria, name: 'custom' }).name).toBe('custom')
  })

  it('genera todas las variables CSS', () => {
    const style = themeToStyle(themes.joyeria)
    for (const key of ['--ck-primary', '--ck-bg', '--ck-surface', '--ck-text', '--ck-muted', '--ck-on-primary', '--ck-font-heading', '--ck-font-body', '--ck-radius']) {
      expect(style[key]).toBeTruthy()
    }
  })
})