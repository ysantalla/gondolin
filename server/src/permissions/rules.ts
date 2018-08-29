// src/permissions/rules.ts
import { rule } from 'graphql-shield';
import { Context, getUserId } from '../utils';

export const isAuthenticated = rule()(async (parent, args, ctx: Context, info) => {
  const userId = getUserId(ctx);
  // Is there a USER with such ID in our database (Prisma)?
  return ctx.db.exists.User({ id: userId });
});

export const isUser = rule()(async (parent, args, ctx: Context, info) => {
  const userId = getUserId(ctx);
  // Is there a USER and ROLE with such ID in our database (Prisma)?  
  return ctx.db.exists.User({id: userId, roles_some: {name: "USER"}});
});

export const isAdmin = rule()(async (parent, args, ctx: Context, info) => {
  const userId = getUserId(ctx);
  // Is there a USER and ROLE with such ID in our database (Prisma)?  
  return ctx.db.exists.User({id: userId, roles_some: {name: "ADMIN"}});
});
