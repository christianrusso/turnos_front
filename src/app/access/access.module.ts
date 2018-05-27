import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccessRoutingModule } from './access-routing.module';

// Servicios
import { AccountService } from './../service/account.service';

// Pantallas y componentes
import { AccessComponent } from './access.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AccessRoutingModule
    ],
    declarations: [
        // Paginas principales del layout
        AccessComponent,
        LoginComponent,
    ],
    // Servicios
    providers: [
        AccountService,
    ]
})
export class AccessModule {}
