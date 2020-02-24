import { TestBed, inject } from '@angular/core/testing';

import { RuncommandsService } from './runcommands.service';

describe('RuncommandsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuncommandsService]
    });
  });

  it('should be created', inject([RuncommandsService], (service: RuncommandsService) => {
    expect(service).toBeTruthy();
  }));
});
