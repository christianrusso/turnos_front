import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Specialty } from '../model/specialty.class';
import { SelectOption } from '../model/select/select-option.class';
import { LetterFilter } from '../model/letter-filter.class';
import { SpecialtyFilter } from '../model/specialty-filter.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class SpecialtyService extends BaseService {

    private url = '/Specialty';

    constructor(
        protected httpClient: HttpClient,
        protected modalService: NgbModal,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, modalService, toastrService, loaderService);
    }

    public add(specialty: Specialty): Observable<Object> {
        return this.post(this.url + '/Add', null, specialty);
    }

    public remove(specialty: Specialty): Observable<Object> {
        return this.post(this.url + '/Remove', null, specialty);
    }

    public edit(specialty: Specialty): Observable<Object> {
        return this.post(this.url + '/Edit', null, specialty);
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
