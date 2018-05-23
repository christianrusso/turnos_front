import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessComponent } from './access.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        component: AccessComponent,
        children: [
            { path: '', redirectTo: 'Login' },
            { path: 'Login', component: LoginComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccessRoutingModule {}
