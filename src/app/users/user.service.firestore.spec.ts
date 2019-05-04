import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { FirestoreUserService } from './user.service.firestore';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreUserService]
    });
  });

  it('should be created', inject([FirestoreUserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
