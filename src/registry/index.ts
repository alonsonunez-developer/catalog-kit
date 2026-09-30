import type { Component } from 'vue'
import type { z } from 'zod'

export interface ComponentDefinition {
  name: string
  description: string
  category: string
  propsSchema: z.ZodType // los defaults viven en el schema con .default()
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