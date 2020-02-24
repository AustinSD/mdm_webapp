import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Device } from '../device';
import { DeviceService } from '../device.service';
import { WifidevicesComponent } from '../wifidevices/wifidevices.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  devices: Device[];
  @Output('selectedDevice') selectedDevice = new EventEmitter<Device>();
  dataRefresher: any;

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    this.getDevices();
    this.refreshData();
  }

  onSelect(device: Device) {
    this.selectedDevice.emit(device);
  }

  getDevices(): void {
    this.deviceService.getDevices()
      .subscribe(devices => this.devices = devices);
  }

  refreshData() {
    this.dataRefresher =
      setInterval(() => {
        this.getDevices();
        //Passing the false flag would prevent page reset to 1 and hinder user interaction
      }, 10000);
  }
}
