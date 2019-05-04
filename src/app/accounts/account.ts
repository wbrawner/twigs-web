import * as firebase from 'firebase/app';

export class Account {
    id: string;
    name: string;
    description: string;
    currency: string;

    static fromSnapshotRef(snapshot: firebase.firestore.DocumentSnapshot): Account {
        const account = new Account();
        account.id = snapshot.id;
        account.name = snapshot.get('name');
        account.description = snapshot.get('description');
        account.currency = snapshot.get('currency');
        return account;
    }
}
