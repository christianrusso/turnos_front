import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Client } from '../model/client.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClientFilter } from '../model/client-filter.class';
import { Employee } from '../model/employee.class';

@Injectable()
export class HairdressingEmployeeService extends BaseService {

    private url = '/HairdressingEmployee';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public register(employee: Employee): Observable<Object> {
        return this.post(this.url + "/Register", null, employee);
    }

    public remove(employee: Employee): Observable<Object> {
        return this.post(this.url + "/Remove", null, employee);
    }

    public getAllEmployees(): Observable<Object[]> {
        return this.getAll(this.url + "/GetAll", null);
    }
}
