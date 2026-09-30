import { registerComponent } from '../registry'
import { HeroDefinition } from './Hero/Hero.definition'
import { CategoryListDefinition } from './CategoryList/CategoryList.definition'
import { ProductGridDefinition } from './ProductGrid/ProductGrid.definition'
import { BannerDefinition } from './Banner/Banner.definition'
import { FooterDefinition } from './Footer/Footer.definition'

;[HeroDefinition, CategoryListDefinition, ProductGridDefinition, BannerDefinition, FooterDefinition].forEach(
  registerComponent,
)