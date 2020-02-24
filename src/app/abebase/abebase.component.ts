import { Component, OnInit } from '@angular/core';

import { Device } from '../device';
import { DeviceService } from '../device.service';
import { RuncommandsService } from '../runcommands.service';

@Component({
  selector: 'app-abebase',
  templateUrl: './abebase.component.html',
  styleUrls: ['./abebase.component.css']
})
export class AbebaseComponent implements OnInit {

  abeList = [];
  abePolicy = '';
  devices: Device[] = [];
  suggList: string[] = [];
  blackList: string[] = [];
  whiteList: string[] = [];
  keyString = [];

  constructor(private deviceService: DeviceService, private runcommand: RuncommandsService) { }

  ngOnInit() {
    this.getDevices();
    this.getMasterKey();
    //this.addToWhiteList('all');
  }

  addToWhiteList(value: string) {
    console.log('Adding to Whitelist: ' + value);

    if (!this.abeList.includes(value)) {
      this.abeList.push(value);
    }

    const index = this.blackList.indexOf(value);
    if (this.blackList.includes(value)) {
      this.blackList.splice(index, 1);
    }

    this.devices.forEach(device => {
      device.key.forEach(key => {
        if (key === value) {
          device.isSelected = true;
        }
      });
    });

    this.whiteList.sort();
    this.blackList.sort();
  }

  removeFromList(value): void {
    console.log('Removing from Whitelist: ' + value);

    const index = this.abeList.indexOf(value);
    if (this.abeList.includes(value)) {
      this.abeList.splice(index, 1);
    }

    if (!this.blackList.includes(value)) {
      this.blackList.push(value);
    }

    this.devices.forEach(device => {
      this.checkDeviceForKey(device, value);
    });

    this.whiteList.sort();
    this.blackList.sort();
  }

  checkDeviceForKey(device, value) {
    let hasKey = false;


    this.abeList.forEach(key => {
      if ( device.key.indexOf(key) > -1) {
        hasKey = true;
      }
    });
    device.key.forEach(key => {
      if (key === value && !hasKey) {
        device.isSelected = false;
      }
    });
  }

  formatBlacklist(keylist): void {
    this.blackList = keylist[0];
    this.blackList.sort();
  }

  /** Get master key from file */
  getMasterKey() {
    this.runcommand.getMasterKey()
    .subscribe(keylist => {
      this.formatBlacklist(keylist);
    });
  }

  /** Get private key from file */
  getPrivateKey(device) {
    this.runcommand.getPrivateKey(device.id)
    .subscribe(keylist => {
      device.key = keylist[0];
    });
  }

  getDevices(): void {
    this.deviceService.getDevices()
      .subscribe(devices => {
        console.log('getDevice');
        devices.forEach(device => {
          this.getPrivateKey(device);
        });
        this.devices = devices;
        this.addUsers();
      });
  }

  addDeviceToList(device): void {
    console.log('Add Device to Policy: ' +  device.id);
    for (let i = 0; i < device.key.length; i++) {
      this.addToWhiteList(device.key[i]);
    }
  }

  generatePolicy(): void {
    console.log('Generate Policy');
    for (let i = 0; i < this.abeList.length; i++) {
      this.abePolicy += this.abeList[i].replace(/\s/g, '_') + ' ';
    }
    if ( this.abeList.length > 1 ) {
      this.abePolicy += '1of' + this.abeList.length;
    }
    console.log(this.abePolicy);
    this.runcommand.generateMessageString('fakeID', this.abePolicy).subscribe();
    this.abePolicy = '';
  }

  addUsers(): void {
    for (let i = 0; i < this.devices.length; i++) {
      switch (this.devices[i].id) {
        case 'HT69K0204194': {
          this.devices[i].user = 'Kim - Enclaves';
          break;
        }
        case 'HT69L0205754': {
          this.devices[i].user = 'Austin';
          break;
        }
        case 'HT73N0204984': {
          this.devices[i].user = 'Charlie';
          break;
        }
        case 'HT75A0201220': {
          this.devices[i].user = 'John';
          break;
        }
        case 'HT7C61C00093': {
          this.devices[i].user = 'Bob';
          break;
        }
        default: {
          this.devices[i].user = 'Unknown';
        }
      }
    }
  }
}
