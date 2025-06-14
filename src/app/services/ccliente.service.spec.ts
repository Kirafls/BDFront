import { TestBed } from '@angular/core/testing';

import { CclienteService } from './ccliente.service';

describe('CclienteService', () => {
  let service: CclienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CclienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
