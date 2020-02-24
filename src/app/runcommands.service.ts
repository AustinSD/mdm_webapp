import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Device } from './device';
import { MessageService } from './message.service';

import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class RuncommandsService {

  // Rest API endpoint defined in environment file
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  runCommand(device: Device, action: string): Observable<Device[]> {
    const runCommandUrl = this.apiUrl + 'runcommand';
    return this.http.post<Device[]>(runCommandUrl + '/' + device.id + '/' + action, [])
      .pipe(
        tap(devices => this.log('Run Command')),
        catchError(this.handleError('runCommand', []))
      );
  }

  runCommandAdvanced(device: Device, action: string): Observable<Device[]> {
    const runCommandAdvancedUrl = this.apiUrl + 'runcommandadvanced';
    return this.http.get<Device[]>(runCommandAdvancedUrl + '/' + device.id + '/' + action)
      .pipe(
        tap(devices => this.log('Run Advanced Command')),
        catchError(this.handleError('runCommandAdvanced', []))
      );
  }

  doProvision(device: Device): Observable<Device[]> {
    const provisioningUrl = this.apiUrl + 'doprovision';
    return this.http.post<Device[]>(provisioningUrl + '/' + device.id, [])
      .pipe(
        tap(devices => this.log('provision devices')),
        catchError(this.handleError('doProvision', []))
      );
  }

  generateMasterKey(action: string, toggle: string): Observable<Device[]> {
    const masterKeyUrl = this.apiUrl + 'gen_master';
    return this.http.post<Device[]>(masterKeyUrl + '/' + action + '/' + toggle, [])
      .pipe(
        tap(devices => this.log('Generate Master Key')),
        catchError(this.handleError('generateMasterKey', []))
      );
  }

  generatePrivateKey(name: string, action: string): Observable<Device[]> {
    const privatekeyUrl = this.apiUrl + 'gen_private';
    console.log(privatekeyUrl + '/' + name + '/' + action);
    return this.http.post<Device[]>(privatekeyUrl + '/' + name + '/' + action, [])
      .pipe(
        tap(devices => this.log('Generate Private Key')),
        catchError(this.handleError('generatePrivateKey', []))
      );
  }

  getMasterKey(): Observable<any> {
    const getkeyUrl = this.apiUrl + 'get_master';
    return this.http.get(getkeyUrl)
      .pipe(
        tap(devices => this.log('Get Master Key')),
        catchError(this.handleError('getMasterKey', []))
      );
  }

  getPrivateKey(device): Observable<any> {
    const getkeyUrl = this.apiUrl + 'get_private/' + device;
    return this.http.get(getkeyUrl)
      .pipe(
        tap(devices => this.log('Get Private Key')),
        catchError(this.handleError('getPrivateKey', []))
      );
  }

  generateMessageString(name: string, action: string): Observable<Device[]> {
    const messageUrl = this.apiUrl + 'gen_message';
    return this.http.post<Device[]>(messageUrl + '/' + name + '/' + action, [])
      .pipe(
        tap(devices => this.log('Generate Message String')),
        catchError(this.handleError('generateMessageString', []))
      );
  }

  connectWifi(id: string): Observable<Device[]> {
    const messageUrl = this.apiUrl + 'wifi_connect';
    return this.http.post<Device[]>(messageUrl + '/' + id, [])
      .pipe(
        tap(devices => this.log('Connect to Wifi')),
        catchError(this.handleError('connectWifi', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RunCommands: ${message}`);
  }
}
