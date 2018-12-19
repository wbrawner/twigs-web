import { TestBed, inject } from '@angular/core/testing';

import { TransactionServiceFirebaseFirestoreImpl } from './transaction.service.firestore';
import { HttpClientModule } from '@angular/common/http';

describe('TransactionServiceFirebaseFirestoreImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [TransactionServiceFirebaseFirestoreImpl]
    });
  });

  it('should be created', inject([TransactionServiceFirebaseFirestoreImpl], (service: TransactionServiceFirebaseFirestoreImpl) => {
    expect(service).toBeTruthy();
  }));
});
