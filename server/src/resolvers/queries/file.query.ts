import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server-core';

export const FileQuery = {  
  async files(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }
    return ctx.db.query.files({...args}, info);
  },
  async file(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }
    return ctx.db.query.file({where: { id: args.id }}, info);
  }
}