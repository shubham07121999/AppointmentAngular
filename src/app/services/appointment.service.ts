import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Appointment } from '../appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'https://localhost:7072/api/appointments'; // backend API

  constructor(private http: HttpClient) {}
   private refreshNeeded$ = new Subject<void>();

  get refreshNeeded() {
    return this.refreshNeeded$.asObservable();
  }

   private editAppointmentSource = new Subject<Appointment>();
    editAppointment$ = this.editAppointmentSource.asObservable();

    sendEditAppointment(appt: Appointment) {
      this.editAppointmentSource.next(appt);
    }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  createAppointment(appointment: Appointment): Observable<string> {
    return this.http.post<string>(this.apiUrl, appointment).pipe(
        tap(() => {
          this.refreshNeeded$.next();
        })
      );;
  }

  updateAppointment(id: number, appointment: Appointment): Observable<void> {
    appointment.id = id;
    return this.http.put<void>(`${this.apiUrl}/${id}`, appointment).pipe(
        tap(() => {
          this.refreshNeeded$.next();
        })
      );;
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   getAppointmentsByID(id:Number): Observable<Appointment> {
    return this.http.get<Appointment>(`this.apiUrl/${id}`);
  }
}
