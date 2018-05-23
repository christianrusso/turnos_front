import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule, NgbDropdownModule, NgbAlertModule  } from '@ng-bootstrap/ng-bootstrap';

import { AccessRoutingModule } from './access-routing.module';

// Servicios
import { AccountService } from './../service/account.service';

// Pantallas y componentes
import { AccessComponent } from './access.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        NgbModalModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbAlertModule.forRoot(),
        FormsModule
    ],
    declarations: [
        // Paginas principales del layout
        AccessComponent,
        LoginComponent,
    ],
    // Servicios
    providers: [
        AccountService,
    ],
    // Popups
    entryComponents: [
    ]
})
export class AccessModule {}
