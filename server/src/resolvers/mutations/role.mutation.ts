import { Context } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';
import { ApolloError } from 'apollo-server-core';


export const RoleMutation = {
  async createRole(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
        
    return await ctx.db.mutation.createRole({
      data: { ...args.data }
    }, info);
  },

  async updateRole(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
        
    const roleExist = await ctx.db.exists.Role({id: args.where.id});

    if (!roleExist) {
      throw new ApolloError(`Role not found`);
    }

    return await ctx.db.mutation.updateRole(
      {
        where: {...args.where},
        data: { ...args.data }
      },
      info
    );
  },

  async deleteRole(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
        
    const roleExist = await ctx.db.exists.Role({id: args.where.id});

    if (!roleExist) {
      throw new ApolloError(`Role not found`);
    }

    return await ctx.db.mutation.deleteRole(
      {
        where: {...args.where}
      },
      info
    );
  },

  async deleteManyRoles(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
        
    return await ctx.db.mutation.deleteManyRoles({
      where: {...args.where}
    },
    info
    );
  }

};
