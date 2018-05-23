import { Component } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../service/account.service';
import { Login } from '../../model/login.class';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../../../styles/bootstrap.min.css',
                '../../../styles/styles.css',
                '../../../styles/responsive.css',
                '../../../font-awesome/css/font-awesome.min.css']
})

export class LoginComponent extends BaseComponent {

    private email: string;
    private password: string;

    constructor(
        private modalService: NgbModal,
        private accountService: AccountService,
        private router: Router,
        private loaderService: Ng4LoadingSpinnerService
    ) {
        super();
        sessionStorage.clear();
    }

    private login() {
        this.loaderService.show();
        let loginData = new Login();
        loginData.email = this.email;
        loginData.password = this.password;
        this.accountService.login(loginData).subscribe(
            res => {
                sessionStorage.setItem("token", res.token);
                this.loaderService.hide();
                this.router.navigate(['Layout']);
            }
        );
    }
}
