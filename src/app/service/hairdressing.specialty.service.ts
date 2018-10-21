import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Specialty } from '../model/specialty.class';
import { SelectOption } from '../model/select/select-option.class';
import { LetterFilter } from '../model/letter-filter.class';
import { SpecialtyFilter } from '../model/specialty-filter.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IdFilter } from '../model/id-filter.class';

@Injectable()
export class HairdressingSpecialtyService extends BaseService {

    private url = '/Hairdressing/HairdressingSpecialty';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(specialtyId: IdFilter): Observable<Object> {
        return this.post(this.url + '/Add', null, specialtyId);
    }

    public remove(specialtyId: IdFilter): Observable<Object> {
        return this.post(this.url + '/Remove', null, specialtyId);
    }

    public getAllSpecialties(): Observable<Specialty[]> {
        return this.getAll<Specialty>(this.url + "/GetAll", null);
    }

    public getAllSpecialtiesForSelect(): Observable<SelectOption[]> {
        return this.getAll<SelectOption>(this.url + "/GetAllForSelect", null);
    }

    public getSpecialtiesByLetter(filter: LetterFilter): Observable<Specialty[]> {
        return this.post(this.url + "/GetByLetter", null, filter);
    }

    public getSpecialtiesByFilter(filter: SpecialtyFilter): Observable<Specialty[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }
}
