import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Device } from '../device';
import { DeviceService} from '../device.service';
import { RuncommandsService} from '../runcommands.service';

@Component({
  selector: 'app-fastbootdevices',
  templateUrl: './fastbootdevices.component.html',
  styleUrls: ['./fastbootdevices.component.css']
})
export class FastbootdevicesComponent implements OnInit {

  devices: Device[];
  selectedDevice: Device;
  dataRefresher: any;

  constructor(private runcommand: RuncommandsService, private deviceService: DeviceService) { }

  ngOnInit() {
    this.getDevices();
	this.refreshData();
  }

  onSelect(device: Device) {
    this.selectedDevice = device;
  }

  getDevices(): void {
    this.deviceService.getFBDevices()
		.subscribe(devices => this.devices = devices);
  }

  doProvision(device: Device): void {
    console.log('Run doProvision: ' + device );
    this.runcommand.doProvision(device).subscribe();
  }

  refreshData(){
    this.dataRefresher =
      setInterval(() => {
        this.getDevices();
        //Passing the false flag would prevent page reset to 1 and hinder user interaction
      }, 10000); 
  }
}
