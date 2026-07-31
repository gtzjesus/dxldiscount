import { type SchemaTypeDefinition } from 'sanity';
// Sin llaves porque product.ts usa export default
import product from './product'; 
import category from './category';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category],
};