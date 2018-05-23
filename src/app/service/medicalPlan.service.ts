import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedicalPlan } from '../model/medicalPlan.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class MedicalPlanService extends BaseService
{
    private url = '/MedicalPlan';

    constructor(
        protected httpClient: HttpClient,
        protected modalService: NgbModal,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, modalService, toastrService, loaderService);
    }

    public add(medicalPlan: MedicalPlan): Observable<Object> {
        return this.post(this.url + '/Add', null, medicalPlan);
    }

    public remove(medicalPlan: MedicalPlan): Observable<Object> {
        return this.post(this.url + '/Remove', null, medicalPlan);
    }

}
