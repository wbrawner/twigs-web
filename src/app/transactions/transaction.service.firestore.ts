import { Observable } from 'rxjs';
import { Transaction } from './transaction';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { TransactionService } from './transaction.service';

export class TransactionServiceFirebaseFirestoreImpl implements TransactionService {

  constructor() { }

  getTransactions(accountId: string, category?: string, count?: number): Observable<Transaction[]> {
    return Observable.create(subscriber => {
      let transactionQuery: any = firebase.firestore()
        .collection('accounts')
        .doc(accountId)
        .collection('transactions')
        .orderBy('date', 'desc');
      if (category) {
        transactionQuery = transactionQuery.where('category', '==', category);
      }
      if (count) {
        transactionQuery = transactionQuery.limit(count);
      }
      transactionQuery.onSnapshot(snapshot => {
        const transactions = [];
        snapshot.docs.forEach(transaction => {
          transactions.push(Transaction.fromSnapshotRef(transaction));
        });
        subscriber.next(transactions);
      });
    });
  }

  getTransaction(accountId: string, id: string): Observable<Transaction> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('transactions').doc(id).onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return;
        }
        subscriber.next(Transaction.fromSnapshotRef(snapshot));
      });
    });
  }

  createTransaction(
    accountId: string,
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Observable<Transaction> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('transactions').add({
        name: name,
        description: description,
        date: date,
        amount: amount,
        category: category,
        isExpense: isExpense,
      }).then(docRef => {
        docRef.get().then(snapshot => {
          if (!snapshot) {
            subscriber.console.error('Unable to retrieve saved transaction data');
            return;
          }
          subscriber.next(Transaction.fromSnapshotRef(snapshot));
        });
      }).catch(err => {
        subscriber.error(err);
      });
    });
  }


  updateTransaction(accountId: string, id: string, changes: object): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('transactions').doc(id).update(changes).then(() => {
        subscriber.next(true);
      }).catch(err => {
        subscriber.next(false);
      });
    });
  }

  deleteTransaction(accountId: string, id: string): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('transactions').doc(id).delete().then(data => {
        subscriber.next(true);
      }).catch(err => {
        console.log(err);
        subscriber.next(false);
      });
    });
  }
}
