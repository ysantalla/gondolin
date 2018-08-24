import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from 'apollo-server-express';

export const RoleQuery = {
  async roles(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
/*
    if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }*/
    return ctx.db.query.roles({ ...args }, info);
  },

  async role(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*
    if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }*/
    return ctx.db.query.role({ where: { id: args.id } }, info);
  }
};
