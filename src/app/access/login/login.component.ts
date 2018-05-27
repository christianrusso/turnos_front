import { Component } from '@angular/core';
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

    public email: string;
    public password: string;

    constructor(
        private accountService: AccountService,
        private router: Router,
        private loaderService: Ng4LoadingSpinnerService
    ) {
        super();
        sessionStorage.clear();
    }

    public login() {
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
