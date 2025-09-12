import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Appointment } from 'src/app/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {

  appointmentForm: FormGroup;
  editMode = false;
  editId?: number;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService) {
    this.appointmentForm = this.fb.group({
      patientName: ['', Validators.required],
      doctorName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.appointmentService.editAppointment$.subscribe((appt: Appointment) => {
    this.editMode = true;
    this.editId = appt.id;
    this.appointmentForm.patchValue(appt);
  });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
        const start = this.appointmentForm.get('startTime')?.value;
        const end = this.appointmentForm.get('endTime')?.value;

        if (start && end && new Date(start) >= new Date(end)) {
          alert('End Time must be greater than Start Time');
          return;
        }
        
       if (this.editMode && this.editId) {
        this.appointmentService.updateAppointment(this.editId, this.appointmentForm.value)
          .subscribe(
        {
              next: () => {
                alert('Appointment updated successfully!');
                this.appointmentForm.reset();
                this.editMode = false;
                this.editId = undefined;
              },
              error: (err) => {
                if (err.status === 400 && err.error) {
                  alert(err.error)
                }
              }
            }
        );
        }else{
            this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
              next: () => {
                alert('Appointment booked successfully!');
                this.appointmentForm.reset();
                this.editMode = false;
                this.editId = undefined;
              },
              error: (err) => {
                if (err.status === 400 && err.error) {
                  alert(err.error)
                }
              }
            });
        }
    }
  }
}
