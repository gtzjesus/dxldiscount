import { type SchemaTypeDefinition } from 'sanity';
// Sin llaves porque product.ts usa export default
import product from './product'; 

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product],
};