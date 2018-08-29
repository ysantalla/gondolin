import { GraphQLResolveInfo } from 'graphql';
import { Context, processUpload, removeFS } from '../../utils';
import { ApolloError } from 'apollo-server-express';


export const FileMutation = {
  async uploadFile(parent, { file }, ctx: Context, info: GraphQLResolveInfo) {
    
    const data = await processUpload(file);
    return await ctx.db.mutation.createFile({
      data
    });
  },

  async uploadFiles(parent, {files}, ctx: Context, info: GraphQLResolveInfo) {    

    return await Promise.all(files.map(async (file) =>  {
      const data: any = await processUpload(file);
      return await ctx.db.mutation.createFile({
        data
      });      
    }));
  },

  async changeFile(parent: any, {file, where}, ctx: Context, info: GraphQLResolveInfo) {    
    
    const fileExist = await ctx.db.exists.File({id: where.id});

    if (!fileExist) {
      throw new ApolloError(`File not found`);
    }

    const oldFile = await ctx.db.query.file({where: {id: where.id}});
    const flag = await removeFS(oldFile.path);
    const data = await processUpload(file);

    return await ctx.db.mutation.updateFile(
      {
        where: {...where},
        data: { ...data }
      },
      info
    );
  },

  async deleteFile(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {    
    
    const FileExist = await ctx.db.exists.File({id: args.where.id});

    if (!FileExist) {
      throw new ApolloError(`File not found`);
    }

    const file = await ctx.db.query.file({where: {id: args.where.id}});
    const flag = await removeFS(file.path);

    return await ctx.db.mutation.deleteFile(
      {
        where: {...args.where}
      },
      info
    );
  },

  async deleteManyFiles(parent: any, args: any, ctx: Context, info: GraphQLResolveInfo) {    

    const files = await ctx.db.query.files({where: {...args.where}});
    const datas = await Promise.all(files.map(file => removeFS(file.path)));

    return await ctx.db.mutation.deleteManyFiles({
      where: {...args.where}
    },
    info
    );
  }
};
