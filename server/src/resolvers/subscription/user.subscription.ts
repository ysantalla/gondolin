import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';

//import { pubsub } from '../../server';

export const UserSubscription = {
  userSubscription: {
    subscribe: (parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {
      //pubsub.asyncIterator(["POST_ADDED"])
      return ctx.db.subscription.user(
        {
          where: {}
        },
        info,
      )
    },
  },
}
