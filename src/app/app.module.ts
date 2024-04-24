import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentService } from './appointment.service'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    CalendarComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule,
    CommonModule  
  ],
  providers: [AppointmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
