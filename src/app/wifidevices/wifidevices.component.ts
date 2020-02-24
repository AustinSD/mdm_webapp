import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WifiDevice } from '../wifi-device';
import { WifiDevicesService } from '../wifi-devices.service';

@Component({
  selector: 'app-wifidevices',
  templateUrl: './wifidevices.component.html',
  styleUrls: ['./wifidevices.component.css']
})
export class WifidevicesComponent implements OnInit {

  wifidevices: WifiDevice[];
  @Output('selectedDevice') selectedDevice = new EventEmitter<WifiDevice>();

  constructor(private wifiDevicevicesService: WifiDevicesService) { }

  ngOnInit() {
    this.getDevices();
  }

  onSelect(wifidevice: WifiDevice) {
    this.selectedDevice.emit(wifidevice);
  }

  getDevices(): void {
    this.wifiDevicevicesService.getWifiDevices()
      .subscribe(wifidevices => this.wifidevices = wifidevices);
  }
}
