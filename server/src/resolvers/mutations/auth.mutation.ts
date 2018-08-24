import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Context, getUserId } from '../../utils';
import { GraphQLResolveInfo } from 'graphql';

import { ApolloError } from 'apollo-server-express';

const APP_SECRET: string = process.env.APP_SECRET;

export const AuthMutation = {
  async signup(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {

    let roleId = await ctx.db.query.role({ where: { name: 'USER' } }, `{id}`);
    const password = await bcrypt.hash(args.data.password, 10);

    if (!roleId) {
      let user = await ctx.db.mutation.createUser(
        {
          data: {
            ...args.data,
            password,
            roles: {
              create: {                
                name: 'USER',
                description: 'USER ROLE'
              }
            }
          }
        },
        `{id firstname email roles {name}}`
      );

      return {
        token: jwt.sign(
          {
            user: {
              id: user.id,
              firstname: user.firstname,
              email: user.email,
              roles: user.roles
            }
          },
          APP_SECRET,
          {
            expiresIn: '24h'
          }
        ),
        user
      };
    }

    let user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args.data,
          password,
          roles: {
            connect: {
              id: roleId.id
            }
          }
        }
      },
      `{id firstname email roles {name}}`
    );

    return {
      token: jwt.sign(
        {
          user: {
            id: user.id,
            firstname: user.firstname,
            email: user.email,
            roles: user.roles
          }
        },
        APP_SECRET,
        {
          expiresIn: '24h'
        }
      ),
      user
    };
  },

  async login(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    const user: any = await ctx.db.query.user(
      { where: {email:  args.email} },
      `{id firstname email password roles  {name}}`
    );
    if (!user) {
      throw new ApolloError(`No such user found for email: ${args.email}`);
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new ApolloError('Invalid password');
    }

    console.log("yasmany");

    return {
      token: jwt.sign(
        {
          user: {
            id: user.id,
            firstname: user.firstname,
            email: user.email,
            roles: user.roles
          }
        },
        APP_SECRET,
        {
          expiresIn: '24h'
        }
      ),
      user
    };
  },

  async changePassword(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    const userId = getUserId(ctx);

    const user: any = await ctx.db.query.user(
      { where: { id: userId } },
      `{id password}`
    );

    if (!user) {
      throw new ApolloError('No such user found');
    }

    const valid = await bcrypt.compare(args.data.oldPassword, user.password);
    if (!valid) {
      throw new ApolloError('Invalid old password');
    }

    const newPasswordHash = await bcrypt.hash(args.data.newPassword, 10);

    try {
      return await ctx.db.mutation.updateUser({
        where: { id: userId },
        data: { password: newPasswordHash }
      });
    } catch (e) {
      return new ApolloError(e);
    }
  },

  async profile(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {
    const userId = getUserId(ctx);

    try {
      const user: any = await ctx.db.mutation.updateUser(
        {
          where: { id: userId },
          data: { ...args.data }
        },
        `{id firstname email roles {name}}`
      );

      return {
        token: jwt.sign(
          {
            user: {
              id: user.id,
              firstname: user.firstname,
              email: user.email,
              roles: user.roles
            }
          },
          APP_SECRET,
          {
            expiresIn: '24h'
          }
        ),
        user
      };
    } catch (e) {
      return e;
    }
  }
};
