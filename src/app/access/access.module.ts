import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccessRoutingModule } from './access-routing.module';
import { ImageCropperModule } from '../imagecropper';

// Servicios
import { AccountService } from './../service/account.service';

// Pantallas y componentes
import { AccessComponent } from './access.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AgmCoreModule } from '@agm/core';
import { NgSelect2Module } from 'ng-select2';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AccessRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyCeS0Tku62WXG03D8NKXgMxA6RNuBKbrSI",
            libraries: ["places"]
          }),
          NgSelect2Module,
        ImageCropperModule
    ],
    declarations: [
        // Paginas principales del layout
        AccessComponent,
        LoginComponent,
        RegisterComponent
    ],
    // Servicios
    providers: [
        AccountService
    ]
})
export class AccessModule {}
