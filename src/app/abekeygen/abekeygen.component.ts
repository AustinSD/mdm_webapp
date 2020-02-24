import { Component, OnInit } from '@angular/core';

import { Device } from '../device';
import { AbeField } from '../device';
import { DeviceService } from '../device.service';
import { RuncommandsService } from '../runcommands.service';

@Component({
  selector: 'app-abekeygen',
  templateUrl: './abekeygen.component.html',
  styleUrls: ['./abekeygen.component.css']
})

export class AbekeygenComponent implements OnInit {
  objectKeys = Object.keys;
  abeList = [];
  abePolicy = '';
  devices: Device[] = [];
  formatedDevices = [];
  masterKey = false;
  masterKeyList = [];
  keyString = [];
  dataRefresher: any;

  constructor(private runcommand: RuncommandsService, private deviceService: DeviceService) { }

  /********************/
  /** Init Functions **/
  /********************/
  ngOnInit() {
    this.getMasterKey();
    this.getDevices();
    this.refreshData();
  }

  /** Get devices from service */
  getDevices(): void {
    this.deviceService.getDevices()
      .subscribe(devices => {
        this.getMasterKey();
        this.addUsers();
        if (!this.masterKey && this.formatedDevices.length === 0) {
          this.formatedDevices = this.convertDevices();
        } else if (this.masterKey && this.formatedDevices.length === 0) {
          this.formatedDevices = this.convertDevices();
        } else if (this.masterKey && this.formatedDevices.length !== 0) {
          const deviceIds = [];
          const newIds = [];
          for (let i = 0; i < devices.length; i++) {
            newIds.push(devices[i].id);
          }
          for (let j = 0; j < this.devices.length; j++) {
            deviceIds.push(this.devices[j].id);
          }
          const missing = newIds.filter(item => deviceIds.indexOf(item) < 0);
          if (missing.length > 0) {
            this.addDevicetoList(missing[0]);
          }
        }
        this.devices = devices;
      });
  }

  /** Get master from file */
  getMasterKey() {
    this.runcommand.getMasterKey()
    .subscribe(keylist => {
      this.keyString = keylist;
      this.checkMasterKey();
    });
  }

  checkMasterKey() {
    if (this.keyString[0] === undefined) {

    } else if (this.keyString[0].length > 0 ) {
      this.masterKey = true;
      this.masterKeyList = this.keyString[0];
    }
  }

  /** Add device to list after Master Keys generation */
  addDevicetoList(device) {
    console.log('Adding device: ' + device);
    const tempAbe: AbeField[] = [];
    const tempFields = this.formatedDevices[0];
    for (let i = 0; i < tempFields.length; i++) {
      const tempDict = new AbeField;
      let value = '';
      let name = '';
      if (tempFields[i].name === 'Serial') {
        name = 'Serial';
        value = device;
      }
     tempDict.name = name;
     tempDict.value = value;
     tempDict.isSelected = true;
     tempAbe.push(tempDict);
    }
    this.formatedDevices.push(tempAbe);
  }

  /** Format devices for use in HTML table */
  convertDevices(): AbeField[] {
    console.log('Convert Devices');
    const tempDevices = [];
    for (let i = 0; i < this.devices.length; i++) {
      const tempAbe: AbeField[] = [];
      for (let key in this.devices[i]) {
        if (this.devices[i].hasOwnProperty(key)) {
          const tempDict = new AbeField;
          if (key === 'enclave' || key === 'status' || key === 'wifi') {
            continue;
          }
          const value = this.devices[i][key];
          if (key === 'id') {
            key = 'Serial';
          }
          if (key === 'release') {
            key = 'Version';
          }
          if (key === 'model') {
            key = 'Model';
         }
         if (key === 'user') {
          key = 'User';
       }
         tempDict.name = key;
         tempDict.value = value;
         tempDict.isSelected = true;
         tempAbe.push(tempDict);
        }
      }
      tempDevices.push(tempAbe);
    }
    return tempDevices;
  }

  /******************************/
  /** Function calls from HTML **/
  /******************************/

  /** Used to toggle isSelected in device */
  toggleSelected(device: AbeField) {
    device.isSelected = !device.isSelected;
  }

  /** Add column to HTML by way of adding field to device */
  addColumn(value: string): void {
    let newKey = true;

    for (let i = 0; i < this.formatedDevices[0].length; i++) {
      if (this.formatedDevices[0][i].name === value) {
        newKey = false;
      }
    }

    if (value && newKey) {
      for (let i = 0; i < this.formatedDevices.length; i++) {
        const tempDict = new AbeField;
        tempDict.name = value;
        tempDict.value = '';
        tempDict.isSelected = false;
        this.formatedDevices[i].push(tempDict);
      }
    }
  }

  /** Remove column from HTML table */
  removeColumn(value: string): void {
    console.log('Remove column: ' + value);

    if (value) {
      for (let i = 0; i < this.formatedDevices.length; i++) {
        for (let j = 0; j < this.formatedDevices[i].length; j++) {
          if (this.formatedDevices[i][j].name === value) {
            this.formatedDevices[i].splice(j, 1);
          }
        }
      }
    }

  }

  /** Generate master key for device group */
  generateMaster(toggle: string): void {
    console.log('Generate Master Key');
    console.log(this.masterKeyList);
    if (!this.masterKey) {
      for (let i = 0; i < this.formatedDevices.length; i++) {
        for (const key in this.formatedDevices[i]) {
          if (this.formatedDevices[i].hasOwnProperty(key)) {
            const value = this.formatedDevices[i][key].value;
            if (!this.masterKeyList.includes(value)  && (value.length > 0)) {
              this.masterKeyList.push(value);
            }
          }
        }
      }
      console.log(this.masterKeyList);
      this.masterKeyList.push('HT69L0205754');
      this.masterKeyList.push('Austin');
      this.runcommand.generateMasterKey(this.masterKeyList.join(), toggle).subscribe();
    } else {
      console.log('Delete master key');
      this.runcommand.generateMasterKey('keyoff', toggle).subscribe();
    }
    this.masterKey = !this.masterKey;
  }

  /** Generate private key for a device */
  generatePrivate(device: AbeField[]): void {
    console.log('Generate & Deploy Private Key');
    const privateKey = [];
    let deviceName = '';
    console.log(device);
    for (let j = 0; j < device.length; j++) {
      let value = device[j].value;
      if (device[j].name === 'Serial') {
        deviceName = device[j].value;
        value = device[j].value;
      }
      if (!privateKey.includes(value) && (value.length > 0)) {
        privateKey.push(value);
      }
      if (device[j].name === 'Serial') {
        deviceName = device[j].value;
      }
    }

    privateKey.push('all');
    console.log(privateKey);
    console.log(privateKey.join());
    this.runcommand.generatePrivateKey(deviceName, privateKey.join()).subscribe();
  }

  /** Generate all priavte keys for devices in list */
  deployAllKeys(): void {
    console.log('Generate & Deploy All Private Keys');

    for (let i = 0; i < this.formatedDevices.length; i++) {
      this.generatePrivate(this.formatedDevices[i]);
    }
  }

  /** Used to create abe key for a message */
  createMessageKey(): void {
    console.log('Create Message Key');
    const messageKey = [];
    for (let i = 0; i < this.formatedDevices.length; i++) {
      for (const j in this.formatedDevices[i]) {
        if (this.formatedDevices[i][j].isSelected) {
          const value = this.formatedDevices[i][j].value;
          if (!messageKey.includes(value)  && (value.length > 0)) {
            messageKey.push(value);
          }
        }
      }
    }
    console.log(messageKey);
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
        case '10.42.0.253:5555': {
          this.devices[i].user = 'Austin';
          break;
        }
        case '10.42.0.239:5555': {
          this.devices[i].user = 'Charlie';
          break;
        }
        case '10.42.0.236:5555': {
          this.devices[i].user = 'John';
          break;
        }
        case '10.42.0.138:5555': {
          this.devices[i].user = 'Bob';
          break;
        }
        default: {
          this.devices[i].user = 'Unknown';
        }
      }
    }
  }

  refreshData() {
    this.dataRefresher =
      setInterval(() => {
        this.getDevices();
        //Passing the false flag would prevent page reset to 1 and hinder user interaction
      }, 2000);
  }
}
