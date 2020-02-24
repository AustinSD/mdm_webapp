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
export class DeviceService {

  // Rest API endpoint defined in environment file
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getDevices(): Observable<Device[]> {
    const devicesUrl = this.apiUrl + 'devices';
    return this.http.get<Device[]>(devicesUrl)
      .pipe(
        tap(devices => this.log('fetched devices')),
        catchError(this.handleError('getDevices', []))
      );
  }

  getFBDevices(): Observable<Device[]> {
    const fastbootDeviceUrl = this.apiUrl + 'fastboot_devices';
    return this.http.get<Device[]>(fastbootDeviceUrl)
      .pipe(
        tap(devices => this.log('fetched fastboot devices')),
        catchError(this.handleError('getFBDevices', []))
      );
  }

  getSingleDevice(name: string): Observable<Device> {
    const singleDeviceUrl = this.apiUrl + 'device' + '/' + name;
    return this.http.get<Device>(singleDeviceUrl).pipe(
      tap(devices => this.log('fetched device ${name}')),
      catchError(this.handleError<Device>('getSingleDevice name=${name}'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`DeviceService: ${message}`);
  }
}
