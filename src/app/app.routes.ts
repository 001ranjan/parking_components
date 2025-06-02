import { PassesRateComponent } from './components/settings/passes-rate/passes-rate.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './components/sistem-pages/session/session.component';
import { StyleGuidComponent } from './style-guid/style-guid.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LoginComponent } from './login/login.component';
import { PassesComponent } from './passes/passes.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { SettingsComponent } from './components/settings/settings/settings.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { ParkingRateComponent } from './components/settings/parking-rate/parking-rate.component';
import { FacilitiesRateComponent } from './components/settings/facilities-rate/facilities-rate.component';
import { TeamComponent } from './components/settings/team/team.component';
import { AuthGuard } from './auth.guard';

// export const routes: Routes = [
//   { path: '', component: LoginComponent },
//   { path: 'session', component: SessionComponent },
//   { path: 'style-guid', component: StyleGuidComponent },
//   { path: 'parking/:id', component: SidenavComponent },
//   { path: 'parking/passes/:id', component: PassesComponent },
//   { path: 'parking/facilities/:id', component: FacilitiesComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'setting/:id', component: SettingsComponent },
//   { path: 'setting/profile/:id', component: ProfileComponent },
//   { path: 'setting/parking-rate/:id', component: ParkingRateComponent },
//   { path: 'setting/passes/:id', component: PassesRateComponent },
//   { path: 'setting/facilities/:id', component: FacilitiesRateComponent },
//   { path: 'setting/team/:id', component: TeamComponent },
//   { path: '**', redirectTo: '', pathMatch: 'full' },
// ];

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'session', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'style-guid', component: StyleGuidComponent },
  { path: 'parking/:id', component: SidenavComponent, canActivate: [AuthGuard] },
  { path: 'parking/passes/:id', component: PassesComponent, canActivate: [AuthGuard] },
  { path: 'parking/facilities/:id', component: FacilitiesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'setting/:id', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'setting/profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'setting/parking-rate/:id', component: ParkingRateComponent, canActivate: [AuthGuard] },
  { path: 'setting/passes/:id', component: PassesRateComponent, canActivate: [AuthGuard] },
  { path: 'setting/facilities/:id', component: FacilitiesRateComponent, canActivate: [AuthGuard] },
  { path: 'setting/team/:id', component: TeamComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
