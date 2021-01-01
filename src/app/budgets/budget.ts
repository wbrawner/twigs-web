import { UserPermission } from '../users/user';
import { uuidv4 } from '../shared/utils';

export class Budget {
    id: string = uuidv4();
    name: string;
    description: string;
    users: UserPermission[];
}
