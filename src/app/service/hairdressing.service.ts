import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Client } from '../model/client.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClientFilter } from '../model/client-filter.class';

@Injectable()
export class HairdressingService extends BaseService {

    private url = '/Hairdressing/Hairdressing';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getHairdressingByFilter(hairdressingId) {
        return this.post(this.url + "/GetByFilter", null, {
            HairdressingId: hairdressingId,
            AvailableAppointmentEndDate: "",
            AvailableAppointmentStartDate: "",
            Cities: [],
            From: 0,
            MedicalInsurances: [],
            Score: 0,
            ScoreQuantity: 0,
            Specialties: [],
            Stars: [],
            Subspecialties: [],
            medicalPlans: [],
            to: 1
        }, false);
    }

    public sendClinicData(data) {
        return this.post(this.url + "/UpdateInformation", null, data);
    }
}
