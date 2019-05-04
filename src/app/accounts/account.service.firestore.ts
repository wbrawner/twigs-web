import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Account } from './account';
import { User } from '../users/user';

export class FirestoreAccountService implements AccountService {
    getAccounts(): Observable<Account[]> {
        return Observable.create(subscriber => {
            const accounts = [];
            firebase.firestore().collection('accounts').onSnapshot(data => {
                if (!data.empty) {
                    data.docs.map(account => accounts.push(Account.fromSnapshotRef(account)));
                }
                subscriber.next(accounts);
            });
        });
    }

    getAccount(id: string): Observable<Account> {
        return Observable.create(subscriber => {
            firebase.firestore().collection('accounts').doc(id).onSnapshot(snapshot => {
                if (!snapshot.exists) {
                    return;
                }
                subscriber.next(Account.fromSnapshotRef(snapshot));
            });
        });
    }

    createAccount(
        name: string,
        description: string,
        currency: string,
        members: User[],
    ): Observable<Account> {
        return Observable.create(subscriber => {
            firebase.firestore().collection('accounts').add({
                name: name,
                description: description,
                members: members.map(member => member.id)
            }).then(docRef => {
                docRef.get().then(snapshot => {
                    if (!snapshot) {
                        subscriber.console.error('Unable to retrieve saved account data');
                        return;
                    }
                    subscriber.next(Account.fromSnapshotRef(snapshot));
                });
            }).catch(err => {
                subscriber.error(err);
            });
        });
    }

    updateAccount(id: string, changes: object): Observable<Account> {
        return Observable.create(subscriber => {
            firebase.firestore().collection('accounts').doc(id).update(changes).then(result => {
                subscriber.next(true);
            }).catch(err => {
                subscriber.next(false);
            });
        });
    }

    deleteAccount(id: string): Observable<boolean> {
        return Observable.create(subscriber => {
            firebase.firestore().collection('accounts').doc(id).delete().then(data => {
                subscriber.next(true);
            }).catch(err => {
                console.log(err);
                subscriber.next(false);
            });
        });
    }
}
