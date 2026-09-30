import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { builtinComponents } from '../src/components'
import { registerComponent, getComponent, listComponents } from '../src/registry'

describe('componentes incluidos', () => {
  it('tienen nombres únicos', () => {
    const names = builtinComponents.map((c) => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it.each(builtinComponents.map((c) => [c.name, c] as const))('%s cumple el contrato', (_name, def) => {
    expect(def.description.length).toBeGreaterThan(10)
    expect(def.category).toBeTruthy()
    // Con props vacías debe producir valores válidos (defaults completos)
    expect(def.propsSchema.safeParse({}).success).toBe(true)
    // Debe poder exportarse como JSON Schema (base para la IA)
    expect(() => z.toJSONSchema(def.propsSchema)).not.toThrow()
  })
})

describe('registry', () => {
  it('registra y recupera componentes', () => {
    builtinComponents.forEach(registerComponent)
    expect(getComponent('Hero')?.name).toBe('Hero')
    expect(getComponent('NoExiste')).toBeUndefined()
    expect(listComponents().length).toBeGreaterThanOrEqual(builtinComponents.length)
  })
})