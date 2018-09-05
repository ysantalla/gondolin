import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';

export const UserSubscription = {
  userSubscription: {
    subscribe: (parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {

      const test = ctx.db.subscription.user(
        {
          where: {}
        },
        info,
      );

      console.log(test);
      return ctx.db.subscription.user(
        {
          where: {}
        },
        info,
      )
    },
  },
}
