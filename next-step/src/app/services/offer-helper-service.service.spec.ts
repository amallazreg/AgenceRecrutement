import { TestBed } from '@angular/core/testing';

import { OfferHelperServiceService } from './offer-helper-service.service';

describe('OfferHelperServiceService', () => {
  let service: OfferHelperServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferHelperServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
