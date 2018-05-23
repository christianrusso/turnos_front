import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedicalInsurance } from '../model/medicalInsurance.class';
import { SelectOption } from '../model/select/select-option.class';
import { LetterFilter } from '../model/letter-filter.class';
import { MedicalInsuranceFilter } from '../model/medicalInsurance-filter.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class MedicalInsuranceService extends BaseService
{
    private url = '/MedicalInsurance';

    constructor(
        protected httpClient: HttpClient,
        protected modalService: NgbModal,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, modalService, toastrService, loaderService);
    }

    public getAllMedicalInsurancesForSelect(): Observable<SelectOption[]> {
        return this.getAll<SelectOption>(this.url + "/GetAllForSelect", null);
    }

    public getMedicalInsuranceByLetter(filter: LetterFilter): Observable<MedicalInsurance[]> {
        return this.post(this.url + "/GetByLetter", null, filter);
    }

    public getMedicalInsuranceByFilter(filter: MedicalInsuranceFilter): Observable<MedicalInsurance[]> {
        return this.post(this.url + "/GetByFilter", null, filter);
    }

    public add(medicalInsurance: MedicalInsurance): Observable<Object> {
        return this.post(this.url + '/Add', null, medicalInsurance);
    }

    public edit(medicalInsurance: MedicalInsurance): Observable<Object> {
        return this.post(this.url + '/Edit', null, medicalInsurance);
    }

    public remove(medicalInsurance: MedicalInsurance): Observable<Object> {
        return this.post(this.url + '/Remove', null, medicalInsurance);
    }

    public getAllMedicalPlanForSelect(): Observable<SelectOption[]> {
        return this.getAll<SelectOption>(this.url + "/GetAllMedicalPlansForSelect", null);
    }
}
