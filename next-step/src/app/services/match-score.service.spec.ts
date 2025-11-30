import { TestBed } from '@angular/core/testing';

import { MatchScoreService } from './match-score.service';

describe('MatchScoreService', () => {
  let service: MatchScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
