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

//hairdressing
import { HairdressingProfessionalListComponent } from './hairdressing-professional-list/professional-list.component';
import { HairdressingSpecialtyListComponent } from './hairdressing-specialty-list/hairdressing-specialty-list.component';
import { HairdressingPatientListComponent } from './hairdressing-patient-list/hairdressing-patient-list.component'
import { HairdressingCalendarComponent } from './hairdressing-calendar/hairdressing-calendar.component';
import {EditarComponent} from "./editar/editar.component";
import { EmployeeComponent } from "./employee/employee.component";
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            //{ path: '', redirectTo: (sessionStorage.getItem('rubro') == "1" ? 'DoctorList' : 'HairdressingProfessionalList') },
            { path: '', redirectTo: 'Home'},
            { path: 'Home', component: HomeComponent },
            { path: 'Editar', component: EditarComponent },
            { path: 'SpecialtyList', component: SpecialtyListComponent },
            { path: 'PatientList', component: PatientListComponent },
            { path: 'DoctorList', component: DoctorListComponent },
            { path: 'AppointmentConfirmation', component: AppointmentConfirmationComponent },
            { path: 'Calendar', component: CalendarComponent },
            { path: 'MedicalInsuranceList', component: MedicalInsuranceComponent },

            { path: 'HairdressingProfessionalList', component:HairdressingProfessionalListComponent},
            { path: 'HairdressingSpecialtyList', component: HairdressingSpecialtyListComponent },
            { path: 'HairdressingPatientList', component: HairdressingPatientListComponent },
            { path: 'HairdressingCalendar', component: HairdressingCalendarComponent },

            { path: 'Employee', component: EmployeeComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule, AngularMultiSelectModule, NgMultiSelectDropDownModule ]
})
export class LayoutRoutingModule {}
