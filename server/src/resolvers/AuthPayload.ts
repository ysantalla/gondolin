import { Context } from '../utils';
import { GraphQLResolveInfo } from 'graphql';

export const AuthPayload = {
  user: async (parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {
    return ctx.db.query.user({ where: { id: parent.user.id } }, info)
  },
}
