import { importSchema } from 'graphql-import';
import * as path from 'path';

export const typeDefs = importSchema(path.resolve('src/schemas/schema.graphql'));
