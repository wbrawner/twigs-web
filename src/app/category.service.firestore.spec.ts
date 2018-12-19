import { TestBed, inject } from '@angular/core/testing';

import { CategoryServiceFirebaseFirestoreImpl } from './category.service.firestore';

describe('CategoryServiceFirebaseFirestoreImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryServiceFirebaseFirestoreImpl]
    });
  });

  it('should be created', inject([CategoryServiceFirebaseFirestoreImpl], (service: CategoryServiceFirebaseFirestoreImpl) => {
    expect(service).toBeTruthy();
  }));
});
