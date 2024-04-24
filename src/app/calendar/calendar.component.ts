import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { Appointment, AppointmentService } from '../appointment.service';
import { EventInput } from '@fullcalendar/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  bookedSlots: any[] = []; 
  appointments: Appointment[] = [];
  loggedInUsername: string = '';

  @ViewChild('calender') calender!: any;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
    eventClick: (event: EventInput) => this.handleAppointmentClick(event), 
  };

  constructor(private router: Router, private appointmentService: AppointmentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadLoggedInUsername() {
  }
  
  handleDateClick(arg: DateClickArg) {
    const title = prompt(`Book Your appointment with ${this.loggedInUsername}:`); 
    if (title) {
      const clickedDate = arg.date; // Get the clicked date
      const timeZoneOffset = clickedDate.getTimezoneOffset(); // Get the current timezone offset in minutes
      const dateInLocalTimezone = new Date(clickedDate.getTime() - timeZoneOffset * 60000); // Convert clicked date to local time
      const formattedDate = dateInLocalTimezone.toISOString().split('T')[0]; // Extract the date part in YYYY-MM-DD format
  
      this.appointmentService.bookAppointment(title, formattedDate).subscribe((res: any) => {
        if (res) {
          this.loadAppointments();
        }
      });
    }
  }

  handleAppointmentClick(event: EventInput) {

    const confirmation = confirm('Are you sure you want to cancel this appointment?');
    if (confirmation) {
      // Assuming event.id holds the appointmentId
      const appointmentId = (event as any).event._def.extendedProps.appId as any;
      this.cancleAppointment(appointmentId);
    }
  }
  
  cancleAppointment(appointmentId: string) {
    this.appointmentService.cancleAppointment(appointmentId).subscribe(() => {
      this.loadAppointments();
    });
  }

  loadAppointments() {
    this.appointmentService.get().subscribe((res: any) => {
        const events = res.map((slot: any) => ({
            title: `${slot.description} - ${slot.user.userName}`,
            date: slot.appointmentDate,
            appId: slot.appointmentId  
        }));
        this.calendarOptions.events = events;
    });
  }
  
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); 
      localStorage.clear();
    });
  }
}
