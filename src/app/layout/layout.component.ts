import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../service/account.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['layout.component.css']
})

export class LayoutComponent {

    public logo: string;
    public rubro: string;

    constructor (
        private accountService: AccountService,
        private router: Router
    ) {
        this.logo = sessionStorage.getItem("logo");
        this.rubro = sessionStorage.getItem("rubro");
    }

    logout() {
        this.accountService.logout().subscribe(ok => {
            sessionStorage.clear();
            this.router.navigate(['']);
        });
    }
}
