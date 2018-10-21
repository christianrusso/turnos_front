import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { HairdressingProfessional } from '../model/hairdressing-professional.class';
import { HairdressingProfessionalFilter } from '../model/hairdressing-professional-filter.class';
import { SelectOption } from '../model/select/select-option.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class HairdressingProfessionalService extends BaseService {

    private url = '/Hairdressing/HairdressingProfessional';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(professional: HairdressingProfessional): Observable<Object> {
        return this.post(this.url + '/Add', null, professional);
    }

    public remove(professional: HairdressingProfessional): Observable<Object> {
        return this.post(this.url + '/Remove', null, professional);
    }

    public edit(professional: HairdressingProfessional): Observable<Object> {
        return this.post(this.url + '/Edit', null, professional);
    }

    public getAllProfessionals(): Observable<HairdressingProfessional[]> {
        return this.getAll<HairdressingProfessional>(this.url + "/GetAll", null);
    }

    public getAllProfessionalsByFilter(filter: HairdressingProfessionalFilter): Observable<HairdressingProfessional[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }

    public getAllProfessionalsForSelect(): Observable<SelectOption[]> {
        return this.getAll<SelectOption>(this.url + "/GetAllForSelect", null);
    }
}
