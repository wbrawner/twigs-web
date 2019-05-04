import { Injectable } from '@angular/core';
import { of, Observable, from } from 'rxjs';
import { Category } from './category';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceFirebaseFirestoreImpl {

  constructor() { }

  getCategories(group: string, count?: number): Observable<Category[]> {
    return Observable.create(subscriber => {
      let query = firebase.firestore().collection('categories').where('group', '==', group);
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
          categories.push(Category.fromSnapshotRef(categoryDoc));
        }
        subscriber.next(categories);
      }, error => {
        console.error('Got an error while getting categories');
        console.error(error);
      });
    });
  }

  getCategory(id: string): Observable<Category> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('categories').doc(id).onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return;
        }

        subscriber.next(Category.fromSnapshotRef(snapshot));
      });
    });
  }

  createCategory(name: string, amount: number, group: string): Observable<Category> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('categories').add({
        name: name,
        amount: amount,
        group: group,
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
          subscriber.next(Category.fromSnapshotRef(snapshot));
        }).catch(err => {
          console.error(err);
        });
      }).catch(err => {
        console.error(err);
        subscriber.error(err);
      });
    });
  }

  updateCategory(id: string, changes: object): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('categories').doc(id).onSnapshot(snapshot => {
        if (!snapshot.exists) {
          return;
        }

        subscriber.next(Category.fromSnapshotRef(snapshot));
      });
    });
  }

  deleteCategory(id: string): Observable<boolean> {
    return Observable.create(subscriber => {
      firebase.firestore().collection('categories').doc(id).delete().then(result => {
        subscriber.next(true);
      }).catch(err => {
        console.error(err);
        subscriber.next(false);
      });
    });
  }
}
