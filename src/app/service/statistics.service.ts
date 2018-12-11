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
export class StatisticsService extends BaseService {

    private url = '/Statistics';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getAllStatistics() {
        return this.getAll(this.url + "/GetForClinic", null);
    }

    public getAllStatisticsHairdress() {
        return this.getAll(this.url + "/GetForHairdressing", null);
    }
}
