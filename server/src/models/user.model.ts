import { Role } from "./role.model";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  roles: Role[];
}
