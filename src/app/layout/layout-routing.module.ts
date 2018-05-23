import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

// Pantallas
import { HomeComponent } from './home/home.component';
import { SpecialtyListComponent } from './specialty-list/specialty-list.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { AppointmentConfirmationComponent } from './appointment-confirmation/appointment-confirmation.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MedicalInsuranceComponent } from './medical-insurance-list/medical-insurance-list.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'Home' },
            { path: 'Home', component: HomeComponent },
            { path: 'SpecialtyList', component: SpecialtyListComponent },
            { path: 'PatientList', component: PatientListComponent },
            { path: 'DoctorList', component: DoctorListComponent },
            { path: 'AppointmentConfirmation', component: AppointmentConfirmationComponent },
            { path: 'Calendar', component: CalendarComponent },
            { path: 'MedicalInsuranceList', component: MedicalInsuranceComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
