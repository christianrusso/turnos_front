import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseService } from './base.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Logon } from '../model/logon.class';
import { Register } from '../model/register.class';
import { SelectOption } from '../model/select/select-option.class';
@Injectable()
export class RegisterService extends BaseService {

  private url = '/Account';

  constructor(
      protected httpClient: HttpClient,
      protected toastrService: ToastrService,
      protected loaderService: Ng4LoadingSpinnerService
  ) {
      super(httpClient, toastrService, loaderService);
  }

  public register(register: Register): Observable<Register> {
    return this.post<Register>(this.url + '/Register', null, register);
  }

  public getCitycSelect(): Observable<SelectOption[]> {
    return this.post('/Data/GetCitiesForSelect', null, {});
  }

}
