import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddnewbudgetComponent } from './addnewbudget/addnewbudget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PickerComponent } from './picker/picker.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    HomepageComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddnewbudgetComponent,
    PickerComponent,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot(),
    ChartsModule

  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
