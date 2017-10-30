import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientViewComponent } from './client-view/client-view.component';

import { ClientsService } from './services/clients.service';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { CreateSourceComponent } from './create-source/create-source.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    CreateClientComponent,
    ClientViewComponent,
    CampaignViewComponent,
    SearchBarComponent,
    CreateCampaignComponent,
    CreateSourceComponent,
    ChangePasswordComponent,
    RegisterComponent
  ],
  imports: [BrowserModule, FormsModule, HttpModule, AppRoutingModule],
  providers: [ClientsService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {}
