import { getUserId, Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';


export const UserQuery = {
  
  async users(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {    
    return ctx.db.query.users({...args}, info);
  },

  async me(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    const id = getUserId(ctx);    
    console.log(id);
    return ctx.db.query.user({where: {id: id } }, info);
  },

  async user(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    return ctx.db.query.user({where: { id: args.id }}, info);
  }
}
