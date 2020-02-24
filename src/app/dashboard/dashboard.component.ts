import { Component, OnInit } from '@angular/core';
import { Device } from '../device';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  selectedDevice: Device;

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {  }

  onSelect(res) {
    this.selectedDevice = res;
  }

  onChanged(bool: Boolean) {
	console.log('Device Details update');
  }

}
