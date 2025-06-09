import { TestBed } from '@angular/core/testing';

import { NuserService } from './nuser.service';

describe('NuserService', () => {
  let service: NuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
