import { uuidv4 } from "../shared/utils";

export class User {
  id: string = uuidv4();
  username: string;
  email: string;

  constructor(id?: string, username?: string, email?: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

export class UserPermission {
  user: User;
  permission: Permission;

  constructor(user: User, permission: Permission) {
    this.user = user;
    this.permission = permission;
  }
}

export enum Permission {
  READ,
  WRITE,
  OWNER
}