import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';

export const UserSubscription = {
  userSubscription: {
    subscribe: (parent: any, args: any, ctx: any, info: GraphQLResolveInfo) => {
      return ctx.db.subscription.user(
        {
          where: {}
        },
        info,
      )
    },
  },
}
