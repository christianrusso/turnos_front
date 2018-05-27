import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { MedicalPlan } from '../model/medicalPlan.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SelectOption } from '../model/select/select-option.class';

@Injectable()
export class MedicalPlanService extends BaseService
{
    private url = '/MedicalPlan';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public add(medicalPlan: MedicalPlan): Observable<Object> {
        return this.post(this.url + '/Add', null, medicalPlan);
    }

    public remove(medicalPlan: MedicalPlan): Observable<Object> {
        return this.post(this.url + '/Remove', null, medicalPlan);
    }

    public getAllMedicalPlansOfInsuranceForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetAllOfInsuranceForSelect", null, filter);
    }

}
