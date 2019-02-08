import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Doctor } from '../model/doctor.class';
import { DoctorFilter } from '../model/doctor-filter.class';
import { SelectOption } from '../model/select/select-option.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class DoctorService extends BaseService {

    private url = '/Doctor';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(doctor: Doctor): Observable<Object> {
        return this.post(this.url + '/Add', null, doctor);
    }

    public remove(doctor: Doctor): Observable<Object> {
        return this.post(this.url + '/Remove', null, doctor);
    }

    public edit(doctor: Doctor): Observable<Object> {
        return this.post(this.url + '/Edit', null, doctor);
    }

    public getAllDoctors(): Observable<Doctor[]> {
        return this.getAll<Doctor>(this.url + "/GetAll", null);
    }

    public getAllDoctorsByFilter(filter: DoctorFilter): Observable<Doctor[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }

    public getAllDoctorsForSelect(): Observable<SelectOption[]> {
        return this.getAll<SelectOption>(this.url + "/GetAllForSelect", null);
    }

    public blockDay(filter: DoctorFilter): Observable<Doctor[]> {
        return this.post(this.url + "/BlockDay", null, filter);
    }

    public unblockDay(filter: DoctorFilter): Observable<Doctor[]> {
        return this.post(this.url + "/UnblockDay", null, filter);
    }
}
