import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { Transaction } from './transaction';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { TransactionService } from './transaction.service';

export class TransactionServiceFirebaseFirestoreImpl implements TransactionService {

  constructor() { }

  getTransactionsForCategory(category: string): Observable<Transaction[]> {
    const transactionsQuery = firebase.firestore().collection('transactions').where('category', '==', category);
    return Observable.create(subscriber => {
      const transactions = [];
      transactionsQuery.onSnapshot(data => {
        if (!data.empty) {
          data.docs.map(transaction => transactions.push(Transaction.fromSnapshotRef(transaction)));
        }
        subscriber.next(transactions);
      });
    });
  }

  getTransactions(group: string, count?: number): Observable<Transaction[]> {
    const categoriesQuery = firebase.firestore().collection('categories').where('group', '==', group);
    return Observable.create(subscriber => {
      categoriesQuery.onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          subscriber.error(`Unable to query categories within group ${group}`);
          return;
        }

        const transactions = [];
        querySnapshot.docs.map(categoryDoc => {
          firebase.firestore().collection('transactions').where('category', '==', categoryDoc.id).get().then(results => {
            if (results.empty) {
              return;
            }
            for (const transactionDoc of results.docs) {
              transactions.push(Transaction.fromSnapshotRef(transactionDoc));
            }
          });
        });
        subscriber.next(transactions);
      });
    });
  }

  getTransaction(id: string): Observable<Transaction> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('transactions').doc(id).onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return;
        }
        subscriber.next(Transaction.fromSnapshotRef(snapshot));
      });
    });
  }

  createTransaction(
    name: string,
    description: string,
    amount: number,
    date: Date,
    isExpense: boolean,
    category: string
  ): Observable<Transaction> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('transactions').add({
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


  updateTransaction(id: string, changes: object): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('transactions').doc(id).update(changes).then(result => {
        subscriber.next(true);
      }).catch(err => {
        subscriber.next(false);
      });
    });
  }

  deleteTransaction(id: string): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('transactions').doc(id).delete().then(data => {
        subscriber.next(true);
      }).catch(err => {
        console.log(err);
        subscriber.next(false);
      });
    });
  }
}
