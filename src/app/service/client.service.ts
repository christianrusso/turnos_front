import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Client } from '../model/client.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class ClientService extends BaseService {

    private url = '/Client';

    constructor(
        protected httpClient: HttpClient,
        protected modalService: NgbModal,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, modalService, toastrService, loaderService);
    }

    public getAllClientsNonPatients(): Observable<Client[]> {
        return this.post(this.url + "/GetAllNonPatients", null, null);
    }
}
