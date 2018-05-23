import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModalModule, NgbDropdownModule, NgbAlertModule  } from '@ng-bootstrap/ng-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ToastrModule } from 'ngx-toastr'

import { AppRoutingModule } from './app.module.routing';
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModalModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
        ToastrModule.forRoot()
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AuthGuard
    ],
    entryComponents: [
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
