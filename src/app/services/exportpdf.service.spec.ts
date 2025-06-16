import { TestBed } from '@angular/core/testing';

import { ExportpdfService } from './exportpdf.service';

describe('ExportpdfService', () => {
  let service: ExportpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
