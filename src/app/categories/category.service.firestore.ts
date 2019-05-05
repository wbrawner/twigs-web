import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { Category } from './category';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Account } from '../accounts/account';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceFirebaseFirestoreImpl {

  constructor() { }

  getCategories(accountId: string, count?: number): Observable<Category[]> {
    return Observable.create(subscriber => {
      let query: any = firebase.firestore().collection('accounts').doc(accountId).collection('categories').orderBy('name');
      if (count) {
        query = query.limit(count);
      }
      query.onSnapshot(snapshot => {
        if (snapshot.empty) {
          console.log('Got back empty snapshot for categories');
          subscriber.error('Got back empty snapshot for categories');
          return;
        }

        const categories = [];
        for (const categoryDoc of snapshot.docs) {
          categories.push(Category.fromSnapshotRef(accountId, categoryDoc));
        }
        subscriber.next(categories);
      }, error => {
        console.error('Got an error while getting categories');
        console.error(error);
      });
    });
  }

  getCategory(accountId: string, id: string): Observable<Category> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('categories').doc(id).onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return;
        }

        subscriber.next(Category.fromSnapshotRef(accountId, snapshot));
      });
    });
  }

  createCategory(accountId: string, name: string, amount: number, isExpense: boolean): Observable<Category> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('categories').add({
        name: name,
        amount: amount,
        isExpense: isExpense
      }).then(docRef => {
        if (!docRef) {
          console.error('Failed to create category');
          subscriber.error('Failed to create category');
        }
        docRef.get().then(snapshot => {
          if (!snapshot) {
            subscriber.error('Unable to retrieve saved transaction data');
            return;
          }
          subscriber.next(Category.fromSnapshotRef(accountId, snapshot));
        }).catch(err => {
          console.error(err);
        });
      }).catch(err => {
        console.error('Failed to create new category: ');
        console.error(err);
        subscriber.error(err);
      });
    });
  }

  updateCategory(accountId: string, id: string, changes: object): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('categories').doc(id)
      .update(changes)
        .then(function () {
          subscriber.next(true);
        })
        .catch(function () {
          subscriber.next(false);
        });
    });
  }

  deleteCategory(accountId: string, id: string): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('accounts').doc(accountId).collection('categories').doc(id).delete().then(result => {
        subscriber.next(true);
      }).catch(err => {
        console.error(err);
        subscriber.next(false);
      });
    });
  }
}
