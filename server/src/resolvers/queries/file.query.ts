import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';


export const FileQuery = {  
  async files(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {    
    return ctx.db.query.files({...args}, info);
  },
  async file(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {    
    return ctx.db.query.file({where: { id: args.id }}, info);
  },
  async filesConnection(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    return ctx.db.query.filesConnection({...args}, info);
  }
}