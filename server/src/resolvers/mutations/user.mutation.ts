import * as bcrypt from 'bcryptjs';
import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../utils';
import { ApolloError, AuthenticationError } from 'apollo-server-express';

export const UserMutation = {
  async createUser(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (ctx.user) {
      if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
        throw new AuthenticationError('Not authorized, only ADMIN role user');
      }
    }*/
    
    
    const password = await bcrypt.hash(args.data.password, 10);
    return await ctx.db.mutation.createUser(
      {
        data: {
          ...args.data,
          password: password,
        }
      },
      info
    );
  },

  async updateUser(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }*/
    const userExist = await ctx.db.exists.User({
      id: args.where.id
    });

    if (!userExist) {
      throw new ApolloError(`User not found`);
    }

    if (args.data.password) {
      const password = await bcrypt.hash(args.data.password, 10);
      args.data.password = password;
    }    
    
    return await ctx.db.mutation.updateUser(
      {
        where: { ...args.where },
        data: {
          ...args.data
        }
      },
      info
    );
  },

  async deleteUser(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }*/

    const userExist = await ctx.db.exists.User({
      id: args.where.id});

    if (!userExist) {
      throw new ApolloError(`User not found`);
    }

    return await ctx.db.mutation.deleteUser(
      {
        where: {...args.where}
      },
      info
    );
  },

  async deleteManyUsers(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    /*if (!ctx.user.roles.find(role => role.name == 'ADMIN')) {
      throw new AuthenticationError('Not authorized, only ADMIN role user');
    }*/
    return await ctx.db.mutation.deleteManyUsers({
      where: {...args.where}
    },
    info
    );
  }
};
