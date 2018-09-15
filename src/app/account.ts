import { IAccount } from './budget-database'

export class Account implements IAccount {
    id: number;
    remoteId: number;
    name: string;
}
