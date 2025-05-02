import { TestBed } from '@angular/core/testing';

import { SistemService } from './sistem.service';

describe('SistemService', () => {
  let service: SistemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SistemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
