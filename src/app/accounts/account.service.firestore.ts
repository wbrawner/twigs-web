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
            firebase.auth().onAuthStateChanged(user => {
                if (user == null) { return; }
                firebase.firestore().collection('accounts')
                    .orderBy('name')
                    .where('members', 'array-contains', user.uid)
                    .onSnapshot(
                        data => {
                            if (!data.empty) {
                                data.docs.map(account => accounts.push(Account.fromSnapshotRef(account)));
                            }
                            subscriber.next(accounts);
                        },
                        error => {
                            console.error(error);
                        });
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
        members: string[],
    ): Observable<Account> {
        return Observable.create(subscriber => {
            firebase.firestore().collection('accounts').add({
                name: name,
                description: description,
                currency: currency,
                members: members
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
