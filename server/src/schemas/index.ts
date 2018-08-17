import { importSchema } from 'graphql-import';
import { gql } from 'apollo-server-express';

import { mergeSchemas } from 'graphql-tools';

const importedTypeDefs = importSchema('./src/schemas/schema.graphql');

const typeSchema = gql`
  ${importedTypeDefs}
`;

export const typeDefs = typeSchema;

