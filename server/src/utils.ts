import { createWriteStream, unlinkSync, exists } from 'fs';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';

import { ApolloError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';

import { CONFIG } from './config';
import { User } from './models/user.model';

export interface Context {
  db: Prisma;
  req: any;
  res: any;
  user: User;
}

const ROOTDIR = './src';

export function getUserId(ctx: Context) {
  const tokenDecoded: any = getTokenDecoded(ctx.req);
  if (tokenDecoded) {
    return tokenDecoded.user.id;
  }
  return null;
}

export function getAuthUser(req: any) {
  const tokenDecoded: any = getTokenDecoded(req);
  if (tokenDecoded) {
    return tokenDecoded.user;
  }
  return null;
}

function getTokenDecoded(req: any): any {
  const Authorization = req.get('Authorization') || null;
  const secret: any = CONFIG.APP_SECRET;

  if (Authorization) {
    const token: string = Authorization.replace('Bearer ', '');
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      console.log(error);
    }
  }
  return null;
}

async function storeFS({ stream, filename }): Promise<any> {
  
  const folderId = shortid.generate();
  mkdirp.sync(`${ROOTDIR}/uploads/${folderId}`);
  const path = `uploads/${folderId}/${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          unlinkSync(path);
        reject(error);
      })
      .pipe(createWriteStream(`${ROOTDIR}/${path}`))
      .on('finish', () => resolve({ path }))
      .on('error', error => reject(error))
  );
}

export async function removeFS(filepath: string): Promise<any> { 

  return new Promise((resolve, reject) => {
      try {
        unlinkSync(`${ROOTDIR}/${filepath}`);
        resolve(true);
      } catch (err) {
        console.log(err);
        resolve(false);
      }
  });
}

export async function processUpload(file) {
  const { stream, filename, mimetype, encoding } = await file;
  const { path } = await storeFS({ stream, filename });
  return { filename, mimetype, encoding, path };
}
