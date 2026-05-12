import { TestBed } from '@angular/core/testing';

import { BuilderState } from './builder-state';

describe('BuilderState', () => {
  let service: BuilderState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuilderState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
