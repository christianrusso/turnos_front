import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { HairdressingPatient } from '../model/hairdressing-patient.class';
import { RequestAppointmentClient } from '../model/request-appointment-client.class';
import { HairdressingPatientFilter } from '../model/hairdressing-patient-filter.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PatientFilter } from '../model/patient-filter.class';
import { PatientFicha } from '../model/patient-ficha.class';
import { SearchUserFilter } from '../model/searchuser.filter.class';
import { SearchUser } from '../model/searchuser.class';

@Injectable()
export class HairdressingPatientService extends BaseService {

    private url = '/Hairdressing/HairdressingPatient';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(patient: HairdressingPatient): Observable<Object> {
        return this.post(this.url + '/Add', null, patient);
    }

    public addForNonClient(patient: HairdressingPatient): Observable<Object> {
        return this.post(this.url + '/AddForNonClient', null, patient);
    }

    public remove(patient: HairdressingPatient): Observable<Object> {
        return this.post(this.url + '/Remove', null, patient);
    }

    public edit(patient: HairdressingPatient): Observable<Object> {
        return this.post(this.url + '/Edit', null, patient);
    }

    public getAllPatients(): Observable<HairdressingPatient[]> {
        return this.getAll<HairdressingPatient>(this.url + "/GetAll", null);
    }

    public getAllPatientsByFilter(filter: HairdressingPatientFilter): Observable<HairdressingPatient[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }

    public getMedicalRecords(filter: PatientFilter): Observable<Object[]> {
        return this.post(this.url + "/GetRecords", null, filter);
    }

    public removeMedicalRecord(filter: PatientFilter): Observable<Object> {
        return this.post(this.url + "/RemoveRecord", null, filter);
    }

    public addMedicalRecord(ficha: PatientFicha): Observable<Object> {
        return this.post(this.url + "/AddRecord", null, ficha);
    }

    public editMedicalRecord(ficha: PatientFicha): Observable<Object> {
        return this.post(this.url + "/EditRecord", null, ficha);
    }

    public searchUser(user: SearchUserFilter): Observable<SearchUser> {
        return this.post(this.url + "/Search", null, user);
    }
}
