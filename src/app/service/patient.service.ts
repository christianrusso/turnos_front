import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Patient } from '../model/patient.class';
import { RequestAppointmentClient } from '../model/request-appointment-client.class';
import { PatientFilter } from '../model/patient-filter.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class PatientService extends BaseService {

    private url = '/Patient';

    constructor(
        protected httpClient: HttpClient,
        protected modalService: NgbModal,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, modalService, toastrService, loaderService);
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
}
