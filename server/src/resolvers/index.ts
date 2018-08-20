// src/resolvers/index.ts
import { UserQuery } from './queries/user.query';
import { UserSubscription } from './subscription/user.subscription';
import { AuthMutation } from './mutations/auth.mutation';
import { AuthPayload } from './AuthPayload';
import { UserMutation } from './mutations/user.mutation';
import { RoleMutation } from './mutations/role.mutation';
import { RoleQuery } from './queries/role.query';
import { Context } from '../utils';
import { GraphQLResolveInfo } from 'graphql';
import { FileMutation } from './mutations/file.mutation';
import { FileQuery } from './queries/file.query';

export const resolvers = {
  Node: {
    __resolveType(parent: any, ctx: Context, info: GraphQLResolveInfo){
      return null;
    },
  },
  Query: {
    ...UserQuery,
    ...RoleQuery,
    ...FileQuery
  },
  Mutation: {
    ...AuthMutation,
    ...UserMutation,
    ...RoleMutation,
    ...FileMutation
  },
  Subscription: {
    ...UserSubscription
  },
  AuthPayload,
}
