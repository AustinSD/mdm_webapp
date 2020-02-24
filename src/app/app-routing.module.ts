import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { DashboardComponent }   from './dashboard/dashboard.component';
import { DevicesComponent }      from './devices/devices.component';
import { DeviceDetailComponent }  from './device-detail/device-detail.component';
import { AbebaseComponent }  from './abebase/abebase.component';
import { AbekeygenComponent }  from './abekeygen/abekeygen.component';
import { FastbootdevicesComponent} from './fastbootdevices/fastbootdevices.component';
 
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: DeviceDetailComponent },
  { path: 'devices', component: DevicesComponent },
  { path: 'fastboot', component: FastbootdevicesComponent },
  { path: 'abe', component: AbebaseComponent },
  { path: 'abekeygen', component: AbekeygenComponent }
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
