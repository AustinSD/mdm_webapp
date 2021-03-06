import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { WifiDevice } from './wifi-device';
import { MessageService } from './message.service';

import { environment } from './../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class WifiDevicesService {

  // Rest API endpoint defined in environment file
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getWifiDevices(): Observable<WifiDevice[]> {
    const devicesUrl = this.apiUrl + 'wifi_devices';
    return this.http.get<WifiDevice[]>(devicesUrl)
      .pipe(
        tap(wifidevices => this.log('fetched wifi devices')),
        catchError(this.handleError('getWifiDevices', []))
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
