import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Client } from '../model/client.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClientFilter } from '../model/client-filter.class';

@Injectable()
export class ClientService extends BaseService {

    private url = '/Client';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public getAllClientsNonPatients(): Observable<Client[]> {
        return this.post(this.url + "/GetAllNonPatients", null, null);
    }

    public getAllClientsNonHairdressingPatients(): Observable<Client[]> {
        return this.post(this.url + "/GetAllNonHairdressingPatients", null, null);
    }

    public getAllClientsNonPatientsByFilter(filter: ClientFilter): Observable<Client[]> {
        return this.post(this.url + "/GetAllNonPatientsByFilter", null, filter);
    }

    public getAllClientsNonHairdressingPatientsByFilter(filter: ClientFilter): Observable<Client[]> {
        return this.post(this.url + "/GetAllNonHairdressingPatientsByFilter", null, filter);
    }
}
