import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { GetHairdressingAppointment } from '../model/get-hairdressing-appointment.class';
import { AppointmentFilter } from '../model/appointment-filter.class';
import { RequestedHairdressingAppointments } from '../model/requested-hairdressing-appointments.class';
import { RequestHairdressingAppointmentPatient } from '../model/request-hairdressing-appointment-patient.class';
import { RequestHairdressingAppointmentClient } from '../model/request-hairdressing-appointment-client.class';
import { RequestHairdressingAppointmentNonClient } from '../model/request-hairdressing-appointment-non-client.class';
import { AppointmentWeekFilter } from '../model/appointment-week-filter.class';
import { WeekDay } from '../model/week-day.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IdFilter } from '../model/id-filter.class';
import { CancelAppointment } from '../model/cancel-appointment.class';

@Injectable()
export class HairdressingAppointmentService extends BaseService {

    private url = '/Hairdressing/HairdressingAppointment';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getAllAvailablesForDay(getAppointment: GetHairdressingAppointment): Observable<string[]> {
        return this.post(this.url + '/GetAllAvailablesForDay', null, getAppointment);
    }

    public getAllAvailablesFromDay(getAppointment: GetHairdressingAppointment): Observable<string[]> {
        return this.post(this.url + '/GetAllAvailablesFromDay', null, getAppointment);
    }

    public requestAppointmentForPatient(requestAppointment: RequestHairdressingAppointmentPatient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForPatient', null, requestAppointment);
    }

    public requestAppointmentForClient(requestAppointment: RequestHairdressingAppointmentClient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForClient', null, requestAppointment);
    }

    public requestAppointmentForNonClient(requestAppointment: RequestHairdressingAppointmentNonClient): Observable<Object> {
        return this.post(this.url + '/RequestAppointmentForNonClient', null, requestAppointment);
    }

    public getRequestedAppointmentsByFilter(appointmentFilter: AppointmentFilter): Observable<RequestedHairdressingAppointments[]> {
        return this.post(this.url + '/GetRequestedAppointmentsByFilter', null, appointmentFilter);
    }

    public getRequestedAppointmentsByWeekFilter(appointmentWeekFilter: AppointmentWeekFilter): Observable<WeekDay[]> {
        return this.post(this.url + '/GetWeek', null, appointmentWeekFilter);
    }

    public completeAppointmentByClinic(appointment: IdFilter): Observable<Object> {
        return this.post(this.url + '/CompleteAppointmentByHairdressing', null, appointment);
    }

    public cancelAppointmentByHairdressing(appointment: CancelAppointment): Observable<Object> {
        return this.post(this.url + '/CancelAppointmentByHairdressing', null, appointment);
    }
}
