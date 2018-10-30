// Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LayoutRoutingModule } from './layout-routing.module';

// Servicios
import { AccountService } from '../service/account.service';
import { SpecialtyService } from '../service/specialty.service';
import { PatientService } from '../service/patient.service';
import { DoctorService } from '../service/doctor.service';
import { AppointmentService } from '../service/appointment.service';
import { SubspecialtyService } from '../service/subspecialty.service';
import { MedicalPlanService } from '../service/medicalPlan.service';
import { MedicalInsuranceService } from '../service/medicalInsurance.service';
import { ClientService } from '../service/client.service';
import { DataService } from '../service/data.service';

//Servicios - Hairdressing
import { HairdressingProfessionalService } from '../service/hairdressing.professional.service';
import { HairdressingSpecialtyService } from '../service/hairdressing.specialty.service';
import { HairdressingSubspecialtyService } from '../service/hairdressing.subspecialty.service';
import { HairdressingPatientService } from '../service/hairdressing-patient.service';
import { HairdressingAppointmentService } from '../service/hairdressing-appointment.service';

// Pantallas y componentes
import { LayoutComponent } from './layout.component';
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
import { HairdressingPatientListComponent } from './hairdressing-patient-list/hairdressing-patient-list.component';
import { HairdressingCalendarComponent } from './hairdressing-calendar/hairdressing-calendar.component';
// Pipes
import { TruncatePipe } from '../pipe/truncate.pipe';
import { SafeHtml } from '../pipe/safe-html.pipe';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        FormsModule,
        NgbModule.forRoot(),
        NgSelect2Module,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule,
    ],
    declarations: [
        LayoutComponent,
        HomeComponent,
        SpecialtyListComponent,
        PatientListComponent,
        DoctorListComponent,
        AppointmentConfirmationComponent,
        CalendarComponent,
        MedicalInsuranceComponent,
        TruncatePipe,
        SafeHtml,

        HairdressingProfessionalListComponent,
        HairdressingSpecialtyListComponent,
        HairdressingPatientListComponent,
        HairdressingCalendarComponent
    ],
    // Servicios
    providers: [
        AccountService,
        SpecialtyService,
        PatientService,
        DoctorService,
        AppointmentService,
        SubspecialtyService,
        MedicalInsuranceService,
        MedicalPlanService,
        ClientService,
        DataService,

        HairdressingProfessionalService,
        HairdressingSpecialtyService,
        HairdressingSubspecialtyService,
        HairdressingPatientService,
        HairdressingAppointmentService
    ]
})
export class LayoutModule {}
