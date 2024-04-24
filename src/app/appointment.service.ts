import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'api/Appointment/SaveAppointment';
  private api = 'api/Appointment';
  private cancleApi = 'api/Appointment/CancleAppointment';

  constructor(private http: HttpClient) { }

  bookAppointment(description: string, appointmentDate: string): Observable<any> {
    const params = new HttpParams()
      .set('description', description)
      .set('appointmentDate', appointmentDate);

    const header = new HttpHeaders().set(
      "Authorization",
      'Bearer ' + localStorage.getItem("token") || ""
    );
    return this.http.post(environment.URL + this.apiUrl, null, { params: params, headers: header });
  }

  get(): Observable<Appointment[]> {
    const header = new HttpHeaders().set(
      "Authorization",
      'Bearer ' + localStorage.getItem("token") || ""
    );
    return this.http.get<Appointment[]>(environment.URL + this.api, { headers: header });
  }

  cancleAppointment(appointmentId: any): Observable<void> {
    const params = new HttpParams().set('appointmentId', appointmentId);
    const header = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token") || "");

    return this.http.delete<void>(environment.URL + this.cancleApi, { params: params, headers: header });
  }
}

export class Appointment {
  appointmentId!: string;
  description!: string; 
  appointmentDate!: string;
} 
