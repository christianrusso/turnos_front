import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SelectOption } from '../model/select/select-option.class';

@Injectable()
export class DataService extends BaseService
{
    private url = '/Data';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getSpecialtiesForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetSpecialtiesForSelect", null, filter);
    }

    public getSubspecialtiesForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetSubspecialtiesForSelect", null, filter);
    }

    public getSubspecialtiesByClinicForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetSubspecialtiesByClinicForSelect", null, filter);
    }

    public getMedicalInsurancesForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetMedicalInsurancesForSelect", null, filter);
    }

    public getMedicalPlansForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetMedicalPlansForSelect", null, filter);
    }

    public getMedicalPlansByClinicForSelect(filter): Observable<SelectOption[]> {
        return this.post(this.url + "/GetMedicalPlansByClinicForSelect", null, filter);
    }
}
