// src/permissions/index.ts
import { shield, and, or } from 'graphql-shield';
import * as rules from './rules';

export const authMiddleware = shield({
  Query: {
    users: rules.isAdmin,
    user: rules.isAdmin,
    me: rules.isAuthenticated,
    roles: rules.isAdmin,
    role: rules.isAdmin,
    files: rules.isAdmin,
    file: rules.isAdmin,
  },
  Mutation: {
    createUser: rules.isAdmin,
    updateUser: rules.isAdmin,
    deleteUser: rules.isAdmin,
    deleteManyUsers: rules.isAdmin,
    profile: rules.isAuthenticated,
    changePassword: rules.isAuthenticated,

    createRole: rules.isAdmin,
    updateRole: rules.isAdmin,
    deleteRole: rules.isAdmin,
    deleteManyRoles: rules.isAdmin,

    uploadFile: rules.isAdmin,
    uploadFiles: rules.isAdmin,
    changeFile: rules.isAdmin,
    deleteFile: rules.isAdmin,
    deleteManyFiles: rules.isAdmin,
  },
});
