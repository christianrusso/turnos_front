import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import { Alert } from '../model/alert.class';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class BaseService {

    //private baseUrl = window.location.protocol + '//' + window.location.hostname + ':5000/Api';

    private baseUrl = 'https://todoreservas.com.ar:4443/api';
    //private baseUrl = 'http://localhost:5000/api';
    private token: string;

    constructor(
        protected httpClient: HttpClient,
        protected toastrService: ToastrService,
        protected loaderService: Ng4LoadingSpinnerService
    ) { }

    protected getAll<T>(apiMethod: string, filter: any): Observable<T[]> {
        return this.httpClient.get<T[]>(this.baseUrl + apiMethod, this.getRequestOptions(true))
        .catch(error => this.handleError<T[]>(error));
    }

    protected get<T>(apiMethod: string, filter: any): Observable<T> {
        return this.httpClient.get<T>(this.baseUrl + apiMethod, this.getRequestOptions(true))
        .catch(error => this.handleError<T>(error));
    }

    protected post<T>(apiMethod: string, filter: any, data: any, useToken = true): Observable<T> {
        return this.httpClient.post<T>(this.baseUrl + apiMethod, data, this.getRequestOptions(useToken))
        .catch(error => this.handleError<T>(error));
    }

    protected getRequestOptions(useToken = true) {
        return {
            headers: this.getHeaders(useToken)
        }
    }

    protected getHeaders(useToken = true): HttpHeaders {
        let token: string = sessionStorage.getItem("token");

        if (token != null && token.length > 0) {
            if (useToken) {
                var headers = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token);
            } else {
                var headers = new HttpHeaders()
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');
            }
            return headers;
        } else {
            return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        }
    }

    protected handleError<T>(error: HttpErrorResponse): Observable<T> {
        this.toastrService.error(this.getHttpErrorMessage(error));
        this.loaderService.hide();
        return Observable.empty<T>();
    }

    protected getHttpErrorMessage(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            return error.error.message;
        } else if (error.status === 500 ||error.status === 400 ) {
            return error.error;
        }  else  {
            return 'Ha ocurrido un error. Intente nuevamente la operacion.';
        }
    }
}
