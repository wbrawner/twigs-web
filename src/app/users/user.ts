import { randomId } from "../shared/utils";

export class User {
  id: string = randomId();
  username: string;
  email: string;

  constructor(id?: string, username?: string, email?: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}

export class AuthToken {
  userId: string;
  token: string;
  expiration: Date;
}

export class UserPermission {
  user: string;
  permission: Permission;

  constructor(user: string, permission: Permission) {
    this.user = user;
    this.permission = permission;
  }
}

export enum Permission {
  READ,
  WRITE,
  MANAGE,
  OWNER
}