import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Client } from '../model/client.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClientFilter } from '../model/client-filter.class';

@Injectable()
export class EmployeeService extends BaseService {

    private url = '/Employee';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public register(): Observable<Object> {
        return this.post(this.url + "/Register", null, null);
    }
}
