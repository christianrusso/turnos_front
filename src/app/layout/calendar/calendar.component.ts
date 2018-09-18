import { Component, AfterViewInit } from '@angular/core';
import { AppointmentService } from '../../service/appointment.service';
import { AppointmentFilter } from '../../model/appointment-filter.class';
import { RequestedAppointments } from '../../model/requested-appointments.class';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { SpecialtyService } from '../../service/specialty.service';
import { SubspecialtyService } from '../../service/subspecialty.service';
import { IdFilter } from '../../model/id-filter.class';
import { DoctorService } from '../../service/doctor.service';
import { GetAppointment } from '../../model/get-appointment.class';
import { PatientService } from '../../service/patient.service';
import { Patient } from '../../model/patient.class';
import { Client } from '../../model/client.class';
import { ClientService } from '../../service/client.service';
import { RequestAppointmentPatient } from '../../model/request-appointment-patient.class';
import { RequestAppointmentClient } from '../../model/request-appointment-client.class';
import { MedicalInsuranceService } from '../../service/medicalInsurance.service';
import { RequestAppointmentNonClient } from '../../model/request-appointment-non-client.class';
import { AppointmentWeekFilter } from '../../model/appointment-week-filter.class';
import { WeekDay } from '../../model/week-day.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { MedicalPlanService } from '../../service/medicalPlan.service';
import { CancelAppointment } from '../../model/cancel-appointment.class';
import * as jsPDF from 'jspdf';
@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent extends BaseComponent implements AfterViewInit {

    public requestedAppointmentsPerDoctor: Array<RequestedAppointments>;
    public specialtyOptions: Array<Select2OptionData>;
    public specialtyFilter: string;

    public subspecialtyOptions: Array<Select2OptionData>;
    public subspecialtyFilter: string;

    public patients = new Array<Patient>();
    public clients = new Array<Client>();

    public startAt: Date;
    public selectedDate: Date;
    public selectedHour: string;
    public selectedDoctor: string;
    public selectedPatient: Patient;
    public selectedClient: Client;
    public doctorOptions: Array<Select2OptionData>;
    public appointments = new Array<string>();

    public firstName: string;
    public lastName: string;
    public address: string;
    public phoneNumber: string;
    public dni: string;
    public medicalInsuranceOptions: Array<Select2OptionData>;
    public medicalInsurance: string;
    public medicalPlanOptions: Array<Select2OptionData>;
    public medicalPlan: string;
    public email: string;
    public password: string;

    public appointmentToCancel = new CancelAppointment();

    public week = new Array<WeekDay>();

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/calendario.js');
    }

    public days: Array<string>;
    public months: Array<string>;
    public currentDate: Date;
    public currentMonday: Date;
    public currentSunday: Date;

    constructor (
        private appointmentService: AppointmentService,
        private specialtyService: SpecialtyService,
        private subspecialtyService: SubspecialtyService,
        private doctorService: DoctorService,
        private patientService: PatientService,
        private clientService: ClientService,
        private medicalInsuranceService: MedicalInsuranceService,
        private medicalPlanService: MedicalPlanService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").addClass('active');
        $("a#obrassocial-panel").removeClass('active');
        this.currentDate = new Date();
        this.startAt = new Date();
        this.currentMonday = this.getMondayOfWeek(this.currentDate);
        this.currentSunday = this.getSundayOfWeek(this.currentDate);
        this.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.specialtyFilter = "-1";
        this.subspecialtyFilter = "-1";
        this.getAllSpecialties();
        this.getAllSubSpecialties();
        this.getAllMedicalInsurance();
        this.getAllDoctors();
        this.getAllPatients();
        this.getAllClientsNonPatients();
    }

    getAllSpecialties() {
        this.loaderService.show();
        this.specialtyService.getAllSpecialtiesForSelect().subscribe(res => {
            this.specialtyOptions = res;
            this.loaderService.hide();
        });;
    }

    getAllSubSpecialties() {
        this.loaderService.show();
        let filter = new IdFilter();
        filter.id = -1
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptions = res;
            this.getCurrentDateAppointments();
            this.getCurrentWeekAppointments();
        });
    }

    getAllDoctors() {
        this.loaderService.show();
        this.doctorService.getAllDoctorsForSelect().subscribe(res => {
            this.doctorOptions = res;
            this.loaderService.hide();
        });
    }

    getAllClientsNonPatients() {
        this.loaderService.show();
        this.clientService.getAllClientsNonPatients().subscribe(res => {
            this.clients = res;
            this.loaderService.hide();
        });
    }

    getAllPatients() {
        this.loaderService.show();
        this.patientService.getAllPatients().subscribe(res => {
            this.patients = res;
            this.loaderService.hide();
        });
    }

    getAllMedicalInsurance(): any {
        this.loaderService.show();
        this.medicalInsuranceService.getAllMedicalInsurancesForSelect().subscribe(res => {
            this.medicalInsuranceOptions = res.slice(0);
            this.medicalInsuranceOptions.shift();
            this.medicalInsurance = "-1";
            this.loaderService.hide();
        });;
    }

    medicalInsuranceChange(selection){
        this.loaderService.show();
        this.medicalInsurance = selection.value;
        this.getAllMedicalPlansOfInsurance();
    }

    private getAllMedicalPlansOfInsurance() {
        const filter = new IdFilter();
        filter.id = parseInt(this.medicalInsurance);
        this.medicalPlanService.getAllMedicalPlansOfInsuranceForSelect(filter).subscribe(res => {
            this.medicalPlanOptions = res;
            this.loaderService.hide();
        })
    }

    reloadPage() {
        this.getCurrentDateAppointments()
        this.getCurrentWeekAppointments();
        this.getAllPatients();
        this.getAllClientsNonPatients();
    }

    specialtyChange(selection) {
        this.loaderService.show();
        this.specialtyFilter = selection.value;
        this.subspecialtyFilter = "-1";
        let filter = new IdFilter();
        filter.id = parseInt(this.specialtyFilter);
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptions = res;
            this.getCurrentDateAppointments();
            this.getCurrentWeekAppointments();
        });
    }

    subspecialtyChange(selection) {
        this.subspecialtyFilter = selection.value;
        this.getCurrentDateAppointments();
        this.getCurrentWeekAppointments();
    }

    medicalPlanChange(selection) {
        this.medicalPlan = selection.value;
    }

    getDayOfWeek(): string {
        return this.days[this.currentDate.getDay()];
    }

    getDate(): string {
        return this.currentDate.getDate() + ' de ' + this.months[this.currentDate.getMonth()];
    }

    getMondayDate(): string {
        return this.currentMonday.getDate() + ' de ' + this.months[this.currentMonday.getMonth()];
    }

    getSundayDate(): string {
        return this.currentSunday.getDate() + ' de ' + this.months[this.currentSunday.getMonth()];
    }

    getMondayOfWeek(date: Date) : Date  {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
        );
    }

    getSundayOfWeek(date: Date) : Date {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay() + (date.getDay() == 0 ? 0 : 7)
        );
    }

    nextDay(): void {
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        this.getCurrentDateAppointments();
    }

    previousDay(): void {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.getCurrentDateAppointments();
    }

    nextWeek(): void {
        this.currentMonday.setDate(this.currentMonday.getDate() + 7);
        this.currentSunday.setDate(this.currentSunday.getDate() + 7);
        this.getCurrentWeekAppointments();
    }

    previousWeek(): void {
        this.currentMonday.setDate(this.currentMonday.getDate() - 7);
        this.currentSunday.setDate(this.currentSunday.getDate() - 7);
        this.getCurrentWeekAppointments();
    }

    getCurrentDateAppointments(): void {
        this.loaderService.show();
        let filter = new AppointmentFilter();
        filter.day = this.currentDate;
        filter.specialtyId = this.specialtyFilter != "-1" ? parseInt(this.specialtyFilter) : null;
        filter.subSpecialtyId = this.subspecialtyFilter != "-1" ? parseInt(this.subspecialtyFilter) : null;
        this.appointmentService.getRequestedAppointmentsByFilter(filter).subscribe(res => {
            this.requestedAppointmentsPerDoctor = res;
            this.loaderService.hide();
        });
    }

    getCurrentWeekAppointments() : void {
        this.loaderService.show();
        let filter = new AppointmentWeekFilter();
        filter.startDate = this.currentMonday;
        filter.endDate = this.currentSunday;
        filter.specialtyId = this.specialtyFilter != "-1" ? parseInt(this.specialtyFilter) : null;
        filter.subSpecialtyId = this.subspecialtyFilter != "-1" ? parseInt(this.subspecialtyFilter) : null;
        this.appointmentService.getRequestedAppointmentsByWeekFilter(filter).subscribe(res => {
            this.week = res;
            this.loaderService.hide();
        });
    }

    getHour(date: string): string {
        let time = date.split('T')[1].split(':');
        return time[0] + ':' + time[1];
    }

    // Pop up
    showRequestAppointment() {
        $(".modal-agregar-turno").fadeIn();
        this.selectedDate = new Date(this.currentDate);
        this.appointments = [];
    }

    hideRequestAppointment() {
        $(".modal-agregar-turno").fadeOut();
    }

    doctorChange(selection) {
        this.loaderService.show();
        this.selectedDoctor = selection.value;
        let getAppointment = new GetAppointment();
        getAppointment.doctorId = parseInt(this.selectedDoctor);
        getAppointment.day = this.selectedDate;
        this.appointmentService.getAllAvailablesForDay(getAppointment).subscribe(res => {
            this.appointments = [];
            res.forEach(appointment => {
                this.appointments.push(this.getHour(appointment));
            });
            this.loaderService.hide();
        });
    }

    selectedPatientChange(selectedPatient) {
        this.selectedPatient = selectedPatient;
    }

    selectedClientChange(selectedClient) {
        this.selectedClient = selectedClient;
    }

    requestAppointmentForPatient() {
        if (this.selectedPatient == null) {
            this.toastrService.error('Debe seleccionar un paciente.');
            return;
        }

        this.loaderService.show();
        let requestAppointment = new RequestAppointmentPatient();
        requestAppointment.doctorId = parseInt(this.selectedDoctor);
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.patientId = this.selectedPatient.id;

        this.appointmentService.requestAppointmentForPatient(requestAppointment).subscribe(ok => {
            $(".modal-agregar-turno").fadeOut();
            this.toastrService.success('Turno reservado correctamente.');
            this.reloadPage();
        });
    }

    requestAppointmentForClient() {
        if (this.selectedClient == null) {
            this.toastrService.error('Debe seleccionar un cliente.');
            return;
        }

        this.loaderService.show();
        let requestAppointment = new RequestAppointmentClient();
        requestAppointment.doctorId = parseInt(this.selectedDoctor);
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.firstName = this.firstName;
        requestAppointment.lastName = this.lastName;
        requestAppointment.address = this.address;
        requestAppointment.phoneNumber = this.phoneNumber;
        requestAppointment.dni = this.dni;
        requestAppointment.medicalPlanId = this.medicalPlan != "-1" ? parseInt(this.medicalPlan) : null;
        requestAppointment.clientId = this.selectedClient.id;

        this.appointmentService.requestAppointmentForClient(requestAppointment).subscribe(ok => {
            $(".modal-agregar-turno").fadeOut();
            this.toastrService.success('Cliente convertido en paciente correctamente.');
            this.toastrService.success('Turno reservado correctamente.');
            this.reloadPage();
        });
    }

    requestAppointmentForNonClient() {
        this.loaderService.show();
        let requestAppointment = new RequestAppointmentNonClient();
        requestAppointment.doctorId = this.selectedDoctor != "-1" ? parseInt(this.selectedDoctor) : null;
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.firstName = this.firstName;
        requestAppointment.lastName = this.lastName;
        requestAppointment.address = this.address;
        requestAppointment.phoneNumber = this.phoneNumber;
        requestAppointment.dni = this.dni;
        requestAppointment.medicalPlanId = this.medicalPlan != "-1" ? parseInt(this.medicalPlan) : null;
        requestAppointment.email = this.email;
        requestAppointment.password = this.password;

        this.appointmentService.requestAppointmentForNonClient(requestAppointment).subscribe(ok => {
            $(".modal-agregar-turno").fadeOut();
            this.toastrService.success('Cliente creado correctamente.');
            this.toastrService.success('Cliente convertido en paciente correctamente.');
            this.toastrService.success('Turno reservado correctamente.');
            this.reloadPage();
        });
    }

    getDayOfWeekDescription(dateString: string): string {
        let datePart = dateString.split('T')[0].split('-');
        let year = parseInt(datePart[0]);
        let month = parseInt(datePart[1]);
        let day = parseInt(datePart[2])
        let date = new Date(year, month - 1, day);
        return this.days[date.getDay()];
    }

    getDateDescription(dateString: string): string {
        let datePart = dateString.split('T')[0].split('-');
        let year = parseInt(datePart[0]);
        let month = parseInt(datePart[1]);
        let day = parseInt(datePart[2])
        let date = new Date(year, month - 1, day);
        return date.getDate() + ' de ' + this.months[date.getMonth()];
    }

    getHourDescription(dateString: string): string {
        let hourPart = dateString.split('T')[1].split(':');
        return hourPart[0] + ':00';
    }

    showCalendarDay() {
        $(".semana-calendario").hide();
        $(".dia-calendario").show();
    }

    showCalendarWeek() {
        $(".dia-calendario").hide();
        $(".semana-calendario").show();
    }

    showPatientTab() {
        $(".paciente-cluster").show();
    }

    showClientTab() {
        $(".cliente-cluster").show(); 
    }

    showNoClientTab() {
        $(".noexiste-cluster").show();
    }

    completeAppointment(appointmentId: number) {
        const appointment = new IdFilter();
        appointment.id = appointmentId;
        this.appointmentService.completeAppointmentByClinic(appointment).subscribe(res => {
            this.toastrService.success('Turno completado exitosamente');
            this.reloadPage();
        });
    }

    showCancelAppointment(appointmentId: number) {
        this.appointmentToCancel.id = appointmentId;
        $(".modal-nueva-especialidad").show();
    }

    closeCancelAppointment() {
        $(".modal-nueva-especialidad").hide();
    }

    cancelAppointment() {
        this.appointmentService.cancelAppointmentByClinic(this.appointmentToCancel).subscribe(res => {
            this.toastrService.success('Turno cancelado exitosamente');
            this.reloadPage();
        });
    }
    dowloadPdf(){
        const doc= new jsPDF();
        var x=15;
        var y=20;
        var xName=10;
        var yName=10;
        this.requestedAppointmentsPerDoctor.forEach(element => {
            doc.setDrawColor(255, 0, 0);
            doc.line(10, yName-8, 200, yName-8);            
            doc.text("Doctor:",10,yName);
            doc.text(element.doctorFirstName,30,yName);
            element.requestedAppointmentsPerHour.forEach(perHour => {
                perHour.appointments.forEach(appoint => {
                    doc.text("Dia: ",10,y);
                    doc.text(appoint.hour,25,y);
                    doc.text("Paciente:",90,y);
                    doc.text(appoint.patient,115,y);
                    y=y+30;
                });
            });
            yName=yName+y+40;

        });
        doc.save('test.pdf');
    }
}