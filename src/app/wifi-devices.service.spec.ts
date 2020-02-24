import { TestBed, inject } from '@angular/core/testing';

import { WifiDevicesService } from './wifi-devices.service';

describe('WifiDevicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WifiDevicesService]
    });
  });

  it('should be created', inject([WifiDevicesService], (service: WifiDevicesService) => {
    expect(service).toBeTruthy();
  }));
});
