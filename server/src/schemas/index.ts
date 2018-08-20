import { importSchema } from 'graphql-import';
//import { gql } from 'apollo-server-express';

export const typeDefs = importSchema('./src/schemas/schema.graphql');

// const typeSchema = gql`
//   ${importedTypeDefs}
// `;

// export const typeDefs = typeSchema;

