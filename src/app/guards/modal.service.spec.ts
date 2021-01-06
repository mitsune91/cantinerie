import { TestBed } from '@angular/core/testing';

import { ModalGuardService } from './modal.guard';

describe('ModalGuardService', () => {
  let service: ModalGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
