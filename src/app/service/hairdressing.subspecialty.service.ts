import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Subspecialty } from '../model/subspecialty.class';
import { Specialty } from '../model/specialty.class';
import { SelectOption } from '../model/select/select-option.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IdFilter } from '../model/id-filter.class';

@Injectable()
export class HairdressingSubspecialtyService extends BaseService {

    private url = '/Hairdressing/HairdressingSubSpecialty';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(subspecialty: Subspecialty): Observable<Object> {
        return this.post(this.url + '/Add', null, subspecialty);
    }

    public remove(subspecialty: Subspecialty): Observable<Object> {
        return this.post(this.url + '/Remove', null, subspecialty);
    }

    public getAllSubspecialties(): Observable<Subspecialty[]> {
        return this.getAll<Subspecialty>(this.url + "/GetAll", null);
    }

    public getAllOfSpecialty(specialty: Specialty): Observable<Subspecialty[]> {
        return this.post(this.url + "/GetAllOfSpecialty", null, specialty);
    }

    public getAllOfSpecialtyForSelect(filter: IdFilter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetAllOfSpecialtyForSelect", null, filter);
    }
}
