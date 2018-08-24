import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';

export const UserSubscription = {
  userSubscription: {
    subscribe: (parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {
      console.log('yasmany');
      return ctx.db.subscription.user(
        {
          where: {}
        },
        info,
      )
    },
  },
}
