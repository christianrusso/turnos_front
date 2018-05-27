import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { Login } from '../model/login.class';
import { Token } from '../model/token.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class AccountService extends BaseService {

    private url = '/Account';

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) {
        super(httpClient, toastrService, loaderService);
    }

    public login(login: Login): Observable<Token> {
        return this.post<Token>(this.url + '/Login', null, login);
    }

    public logout(): Observable<Object> {
        return this.post<Object>(this.url + '/Logout', null, null);
    }
}
