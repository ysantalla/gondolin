import { AuthenticationError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';

import { CONFIG } from './config';
import { User } from './models/user.model';

export interface Context {
  db: Prisma;
  req: any;
  res: any;
  user: User
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.req.get('Authorization');
  const secret: any = CONFIG.APP_SECRET;

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const tokenDecoded: any = jwt.verify(token, secret);
    return tokenDecoded.user.id;
  }

  throw new AuthenticationError('Not authorized');
}

export function getAuthUser(req: any): any {
  const Authorization = req.get('Authorization');
  const secret: any = CONFIG.APP_SECRET;

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const tokenDecoded: any = jwt.verify(token, secret);
    return tokenDecoded.user;
  }

  throw new AuthenticationError('Not authorized');
}
