import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientViewComponent } from './client-view/client-view.component';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CreateSourceComponent } from './create-source/create-source.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clients/create', component: CreateClientComponent },
  { path: 'clients/:client', component: ClientViewComponent },
  { path: 'clients/:client/:campaign', component: CampaignViewComponent },
  {
    path: ':client/create-campaign',
    component: CreateCampaignComponent,
  },
  {
    path: 'clients/:client/:campaign/create-source',
    component: CreateSourceComponent,
  },
  {
    path: 'auth/change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'auth/register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
