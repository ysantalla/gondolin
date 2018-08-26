import { getUserId, Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

export const UserQuery = {
  
  async users(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    const userId = getUserId(ctx);
    const authorization = await ctx.db.exists.User({id: userId, roles_some: {OR: [{name: "ADMIN"}] }});

    if (authorization) {
      return ctx.db.query.users({...args}, info);
    }
    
    throw new AuthenticationError('Not authorized, only ADMIN role user');
  },

  async me(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (ctx.user) {
      if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
        
      }
    }*/
    const id = getUserId(ctx);
    console.log(id);
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
