import { TestBed } from '@angular/core/testing';

import { RulesEngine } from './rules-engine';

describe('RulesEngine', () => {
  let service: RulesEngine;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesEngine);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
