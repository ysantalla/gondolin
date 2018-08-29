import { createWriteStream, unlinkSync, lstatSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';
import * as path from 'path';

import { AuthenticationError } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';
import { Prisma } from './generated/prisma';


export interface Context {
  db: Prisma;
  req: any;
  res: any;
}

export function getUserId(ctx: Context) {
  const Authorization = ctx.req.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const tokenDecoded: any = jwt.verify(token, process.env.APP_SECRET);
    return tokenDecoded.user.id;
  }

  throw new AuthenticationError('Not valid token');
}

async function storeFS({ stream, filename }): Promise<any> {
  
  const folderId = shortid.generate();
  const rootPath = path.join(__dirname, 'uploads', folderId);
  mkdirp.sync(rootPath);
  
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          unlinkSync(`${rootPath}/${filename}`);
        reject(error);
      })
      .pipe(createWriteStream(`${rootPath}/${filename}`))
      .on('finish', () => resolve({ path: `uploads/${folderId}/${filename}`, filePath: `${rootPath}/${filename}`}))
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
        resolve(false);
      }
      reject('Error');
  });
}

export async function processUpload(file) {
  const { stream, filename, mimetype, encoding } = await file;
  const { path, filePath } = await storeFS({ stream, filename });
  
  const size = lstatSync(filePath).size;

  return { filename, mimetype, encoding, path, size};
}
