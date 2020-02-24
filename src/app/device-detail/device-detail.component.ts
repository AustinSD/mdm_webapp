import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Device } from '../device';
import { Enclave } from '../device';
import { RuncommandsService } from '../runcommands.service';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {

  @Input() device: Device;
  @Output() changed = new EventEmitter<boolean>();

  constructor(private runcommand: RuncommandsService, private deviceService: DeviceService) { }

  ngOnInit() { }

  getDevice(): void {
    const name = this.device.id;
    this.deviceService.getSingleDevice(name)
      .subscribe(device => this.device = device);
  }

  doCommand(cmd: string): void {
    console.log('Run doCommand: ' + this.device.id + ' action: ' + cmd);
    this.runcommand.runCommand(this.device, cmd).subscribe();
    this.getDevice();
    this.changed.emit(true);
  }

  doCommandAdvanced(action: string): void {
    let cmd;

    if (action === 'sleep') {
      cmd = 'input keyevent KEYCODE_SLEEP';
    } else if (action === 'wake') {
      cmd = 'input keyevent KEYCODE_WAKEUP';
    }

    console.log('Run doCommandAdvanced: ' + this.device.id + ' action: ' + cmd);
    this.runcommand.runCommandAdvanced(this.device, cmd).subscribe();
  }

  doDestroy(name: string): void {
    console.log('Destroy Enclave: ' + name);

    let enclave: Enclave;
    enclave = this.device.enclave.find(item => item.name === name);

    if (enclave.status === '(active)') {
      this.doSwitch('next');
    }

    this.doCommand('shell cell stop ' + name);
  }

  doStop(name: string): void {
    console.log('Stop Enclave: ' + name);

    let enclave: Enclave;
    enclave = this.device.enclave.find(item => item.name === name);

    if (enclave.status === '(active)') {
      this.doSwitch('next');
    }
    this.doCommand('shell cell stop ' + name);
  }

  doSwitch(name: string): void {
    let cmd = 'shell cell switch ' + name;

    if (name === 'next') {
      cmd = 'shell cell next';
    }

    console.log('Switch to Enclave: ' + name);
    this.doCommand(cmd);
  }

  doStart(name: string): void {
    const cmd = 'shell cell start ' + name;
    console.log('Start to Enclave: ' + name);
    this.doCommand(cmd);
  }

  doWifiConnect(name: string): void {
    console.log('Connect device to adb: ' + name);
    this.runcommand.connectWifi(name).subscribe();
  }
}
