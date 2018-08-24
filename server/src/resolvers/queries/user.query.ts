import { getUserId, Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

export const UserQuery = {
  
  async users(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (ctx.user) {
      if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
        throw new AuthenticationError('Not authorized, only ADMIN role user');
      }
    }*/
    return ctx.db.query.users({...args}, info);
  },

  async me(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (ctx.user) {
      if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
        throw new AuthenticationError('Not authorized, only ADMIN role user');
      }
    }*/
    const id = getUserId(ctx);
    return ctx.db.query.user({where: {id: id } }, info);
  },

  async user(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (ctx.user) {
      if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
        throw new AuthenticationError('Not authorized, only ADMIN role user');
      }
    }*/
    return ctx.db.query.user({where: { id: args.id }}, info);
  }
}
