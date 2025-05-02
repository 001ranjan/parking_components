import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './components/sistem-pages/session/session.component';
import { StyleGuidComponent } from './style-guid/style-guid.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LoginComponent } from './login/login.component';
import { PassesComponent } from './passes/passes.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'session', component: SessionComponent },
  { path: 'style-guid', component: StyleGuidComponent },
  { path: 'parking/:id', component: SidenavComponent },
  { path: 'parking/passes/:id', component: PassesComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
