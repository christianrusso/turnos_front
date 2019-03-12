import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Patient } from '../model/patient.class';
import { RequestAppointmentClient } from '../model/request-appointment-client.class';
import { PatientFilter } from '../model/patient-filter.class';
import { PatientFicha } from '../model/patient-ficha.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchUserFilter } from '../model/searchuser.filter.class';
import { SearchUser } from '../model/searchuser.class';

@Injectable()
export class PatientService extends BaseService {

    private url = '/Patient';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(patient: Patient): Observable<Object> {
        return this.post(this.url + '/Add', null, patient);
    }

    public addForNonClient(patient: Patient): Observable<Object> {
        return this.post(this.url + '/AddForNonClient', null, patient);
    }

    public remove(patient: Patient): Observable<Object> {
        return this.post(this.url + '/Remove', null, patient);
    }

    public edit(patient: Patient): Observable<Object> {
        return this.post(this.url + '/Edit', null, patient);
    }

    public getAllPatients(): Observable<Patient[]> {
        return this.getAll<Patient>(this.url + "/GetAll", null);
    }

    public getAllPatientsByFilter(filter: PatientFilter): Observable<Patient[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }

    public getMedicalRecords(filter: PatientFilter): Observable<Object[]> {
        return this.post(this.url + "/GetMedicalRecords", null, filter);
    }

    public removeMedicalRecord(filter: PatientFilter): Observable<Object> {
        return this.post(this.url + "/RemoveMedicalRecord", null, filter);
    }

    public addMedicalRecord(ficha: PatientFicha): Observable<Object> {
        return this.post(this.url + "/AddMedicalRecord", null, ficha);
    }

    public editMedicalRecord(ficha: PatientFicha): Observable<Object> {
        return this.post(this.url + "/EditMedicalRecord", null, ficha);
    }

    public searchUser(user: SearchUserFilter): Observable<SearchUser> {
        return this.post(this.url + "/Search", null, user);
    }
}
