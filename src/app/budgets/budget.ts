import { User } from '../users/user';

export class Budget {
    id: number;
    name: string;
    description: string;
    users: User[];
}
