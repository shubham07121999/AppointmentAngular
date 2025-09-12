import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Appointment } from 'src/app/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  private subscription!: Subscription;
  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.subscription = this.appointmentService.refreshNeeded.subscribe(() => {
      this.loadAppointments();
    });
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
    });
  }

  deleteAppointment(id: number) {
    if (confirm("Are you sure you want to cancel?")) {
      this.appointmentService.deleteAppointment(id).subscribe(() => {
        this.loadAppointments();
      });
    }
  }

  changeAppointment(appt: Appointment) {
    this.appointmentService.sendEditAppointment(appt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
