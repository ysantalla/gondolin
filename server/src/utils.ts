import { createWriteStream, unlinkSync, exists } from 'fs';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';
import * as path from 'path';

import { ApolloError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';

export interface Context {
  db: Prisma;
  req: any;
  res: any;
}

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
  const secret: any = process.env.APP_SECRET;

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
  const rootPath = path.join(__dirname, 'uploads', folderId);

  mkdirp.sync(rootPath);

  console.log(path.join(__dirname));
  
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          unlinkSync(`${rootPath}/${filename}`);
        reject(error);
      })
      .pipe(createWriteStream(`${rootPath}/${filename}`))
      .on('finish', () => resolve({ path: `uploads/${folderId}/${filename}`}))
      .on('error', error => reject(error))
  );
}

export async function removeFS(filepath: string): Promise<any> { 

  const rootPath = path.join(__dirname);

  return new Promise((resolve, reject) => {
      try {
        unlinkSync(`${rootPath}/${filepath}`);
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
