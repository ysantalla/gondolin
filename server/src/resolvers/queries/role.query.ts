import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';


export const RoleQuery = {
  async roles(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    return ctx.db.query.roles({ ...args }, info);
  },

  async role(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    return ctx.db.query.role({ where: { id: args.id } }, info);
  },

  async rolesConnection(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    return ctx.db.query.rolesConnection({...args}, info);
  }
};
