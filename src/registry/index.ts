import type { Component } from 'vue'
import type { z } from 'zod'

export interface SlotDefinition {
  min: number
  max: number
  label: string
}

export interface ComponentDefinition {
  name: string
  description: string
  category: string // 'layout' | 'catalog' | 'marketing' | 'page-layout'…
  propsSchema: z.ZodType // los defaults viven en el schema con .default()
  // Los layouts de página declaran cuántos productos admiten. El renderer los resuelve
  // y se los pasa al componente en la prop "products".
  slots?: { products?: SlotDefinition }
  component: Component
}

export function defineComponent(def: ComponentDefinition) {
  return def
}

const registry = new Map<string, ComponentDefinition>()

export function registerComponent(def: ComponentDefinition) {
  registry.set(def.name, def)
}
export function getComponent(name: string) {
  return registry.get(name)
}
export function listComponents() {
  return [...registry.values()]
}