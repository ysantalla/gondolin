import { importSchema } from 'graphql-import';
//import { gql } from 'apollo-server-express';

import * as path from 'path';

export const typeDefs = importSchema(path.resolve('src/schemas/schema.graphql'));

// const typeSchema = gql`
//   ${importedTypeDefs}
// `;

// export const typeDefs = typeSchema;

