import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { GetAppointment } from '../model/get-appointment.class';
import { AppointmentFilter } from '../model/appointment-filter.class';
import { RequestedAppointments } from '../model/requested-appointments.class';
import { RequestAppointmentPatient } from '../model/request-appointment-patient.class';
import { RequestAppointmentClient } from '../model/request-appointment-client.class';
import { RequestAppointmentNonClient } from '../model/request-appointment-non-client.class';
import { AppointmentWeekFilter } from '../model/appointment-week-filter.class';
import { WeekDay } from '../model/week-day.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IdFilter } from '../model/id-filter.class';
import { CancelAppointment } from '../model/cancel-appointment.class';

@Injectable()
export class AppointmentService extends BaseService {

    private url = '/Appointment';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getAllAvailablesForDay(getAppointment: GetAppointment): Observable<string[]> {
        return this.post(this.url + '/GetAllAvailablesForDay', null, getAppointment);
    }

    public getAllAvailablesFromDay(getAppointment: GetAppointment): Observable<string[]> {
        return this.post(this.url + '/GetAllAvailablesFromDay', null, getAppointment);
    }

    public requestAppointmentForPatient(requestAppointment: RequestAppointmentPatient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForPatient', null, requestAppointment);
    }

    public requestAppointmentForClient(requestAppointment: RequestAppointmentClient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForClient', null, requestAppointment);
    }

    public requestAppointmentForNonClient(requestAppointment: RequestAppointmentNonClient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForNonClient', null, requestAppointment);
    }

    public getRequestedAppointmentsByFilter(appointmentFilter: AppointmentFilter): Observable<RequestedAppointments[]> {
        return this.post(this.url + '/GetRequestedAppointmentsByFilter', null, appointmentFilter);
    }

    public getRequestedAppointmentsByWeekFilter(appointmentWeekFilter: AppointmentWeekFilter): Observable<WeekDay[]> {
        return this.post(this.url + '/GetWeek', null, appointmentWeekFilter);
    }

    public completeAppointmentByClinic(appointment: IdFilter): Observable<Object> {
        return this.post(this.url + '/CompleteAppointmentByClinic', null, appointment);
    }

    public cancelAppointmentByClinic(appointment: CancelAppointment): Observable<Object> {
        return this.post(this.url + '/CancelAppointmentByClinic', null, appointment);
    }
}
