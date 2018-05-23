import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessModule } from './access/access.module';
import { LayoutComponent } from './layout/layout.component';
import { LayoutModule } from './layout/layout.module';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: () => AccessModule },
    { path: 'Layout', loadChildren: () => LayoutModule, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
