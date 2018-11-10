import { Component } from '@angular/core';
import { AccountService } from '../../service/account.service';
import { Login } from '../../model/login.class';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { SelectOption } from '../../model/select/select-option.class';

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
    public rubro:string = "1";
    public rubros:Array<SelectOption> = [{id:"1", text:"Clinica"},{id:"2", text:"Peluqueria"}]; 

    constructor(
        private accountService: AccountService,
        private router: Router,
        private loaderService: Ng4LoadingSpinnerService
    ) {
        super();
        sessionStorage.clear();
    }

    public onRubroChange(newValue) {
        this.rubro = newValue; 
    }

    public login() {
        this.loaderService.show();
        let loginData = new Login();
        loginData.email = this.email;
        loginData.password = this.password;
        loginData.businessType = this.mapRubro(this.rubro);
        this.accountService.login(loginData).subscribe(
            res => {
                sessionStorage.setItem("token", res.token);
                sessionStorage.setItem("logo", res.logo);
                sessionStorage.setItem("rubro", this.rubro);
                this.loaderService.hide();
                this.router.navigate(['Layout']);
            }
        );
    }

    private mapRubro(rubro) : string{
         if(rubro == "1") return "Clinic";
         if(rubro == "2") return "Hairdressing";

         return "";
    }
}
