import { TestBed, inject } from '@angular/core/testing';

import { AccountService } from './account.service';
import { FirestoreAccountService } from './account.service.firestore';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreAccountService]
    });
  });

  it('should be created', inject([FirestoreAccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
