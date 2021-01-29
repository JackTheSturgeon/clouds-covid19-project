import { TestBed } from '@angular/core/testing';

import { ApidbService } from './apidb.service';

describe('ApidbService', () => {
  let service: ApidbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApidbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
