import { Component, AfterViewInit } from '@angular/core';
import { HairdressingAppointmentService } from '../../service/hairdressing-appointment.service';
import { AppointmentFilter } from '../../model/appointment-filter.class';
import { RequestedHairdressingAppointments } from '../../model/requested-hairdressing-appointments.class';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { HairdressingSpecialtyService } from '../../service/hairdressing.specialty.service';
import { HairdressingSubspecialtyService } from '../../service/hairdressing.subspecialty.service';
import { IdFilter } from '../../model/id-filter.class';
import { HairdressingProfessionalService } from '../../service/hairdressing.professional.service';
import { GetHairdressingAppointment } from '../../model/get-hairdressing-appointment.class';
import { HairdressingPatientService } from '../../service/hairdressing-patient.service';
import { HairdressingPatient } from '../../model/hairdressing-patient.class';
import { Client } from '../../model/client.class';
import { ClientService } from '../../service/client.service';
import { RequestHairdressingAppointmentPatient } from '../../model/request-hairdressing-appointment-patient.class';
import { RequestHairdressingAppointmentClient } from '../../model/request-hairdressing-appointment-client.class';
import { RequestHairdressingAppointmentNonClient } from '../../model/request-hairdressing-appointment-non-client.class';
import { AppointmentWeekFilter } from '../../model/appointment-week-filter.class';
import { WeekDay } from '../../model/week-day.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { CancelAppointment } from '../../model/cancel-appointment.class';
import * as jsPDF from 'jspdf';
import { TouchSequence } from 'selenium-webdriver';
@Component({
    selector: 'app-hairdressing-calendar',
    templateUrl: './hairdressing-calendar.component.html',
    styleUrls: ['./hairdressing-calendar.component.css']
})
export class HairdressingCalendarComponent extends BaseComponent implements AfterViewInit {

    public requestedAppointmentsPerProfessional: Array<RequestedHairdressingAppointments>;
    public specialtyOptions: Array<Select2OptionData>;
    public specialtyFilter: string;

    public subspecialtyOptions: Array<Select2OptionData>;
    public subspecialtyFilter: string;

    public patients = new Array<HairdressingPatient>();
    public clients = new Array<Client>();

    public startAt: Date;
    public selectedDate: Date;
    public selectedHour: string;
    public selectedProfessional: string;
    public selectedPatient: HairdressingPatient;
    public selectedClient: Client;
    public professionalOptions: Array<Select2OptionData>;
    public appointments = new Array<string>();
    public professionalOption: string;

    public firstName: string;
    public lastName: string;
    public address: string;
    public phoneNumber: string;
    public dni: string;
    public email: string;
    public password: string;

    public appointmentToCancel = new CancelAppointment();

    public week = new Array<WeekDay>();

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../panel/assets/calendario.js');
    }

    public days: Array<string>;
    public months: Array<string>;
    public currentDate: Date;
    public currentMonday: Date;
    public currentSunday: Date;

    constructor (
        private appointmentService: HairdressingAppointmentService,
        private specialtyService: HairdressingSpecialtyService,
        private subspecialtyService: HairdressingSubspecialtyService,
        private professionalService: HairdressingProfessionalService,
        private patientService: HairdressingPatientService,
        private clientService: ClientService,
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
        this.getAllProfessionals();
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

    getAllProfessionals() {
        this.loaderService.show();
        this.professionalService.getAllProfessionalsForSelect().subscribe(res => {
            this.professionalOptions = res;
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
            this.requestedAppointmentsPerProfessional = res;
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
        this.professionalOption = ''
        this.selectedHour = null;
        this.selectedDate = new Date(this.currentDate);
        this.appointments = [];
    }

    hideRequestAppointment() {
        $(".modal-agregar-turno").fadeOut();
    }

    professionalChange(selection) {
        this.loaderService.show();
        this.selectedProfessional = selection.value;
        let getAppointment = new GetHairdressingAppointment();
        getAppointment.professionalId = parseInt(this.selectedProfessional);
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

        this.firstName = this.selectedClient.firstName;
        this.lastName = this.selectedClient.lastName;
        this.address = this.selectedClient.address;
        this.phoneNumber = this.selectedClient.phoneNumber;
        this.dni = this.selectedClient.dni;
    }

    requestAppointmentForPatient() {
        if (this.selectedPatient == null) {
            this.toastrService.error('Debe seleccionar un paciente.');
            return;
        }

        this.loaderService.show();
        let requestAppointment = new RequestHairdressingAppointmentPatient();
        requestAppointment.professionalId = parseInt(this.selectedProfessional);
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
        let requestAppointment = new RequestHairdressingAppointmentClient();
        requestAppointment.professionalId = parseInt(this.selectedProfessional);
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.firstName = this.firstName;
        requestAppointment.lastName = this.lastName;
        requestAppointment.address = this.address;
        requestAppointment.phoneNumber = this.phoneNumber;
        requestAppointment.dni = this.dni;
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
        let requestAppointment = new RequestHairdressingAppointmentNonClient();
        requestAppointment.professionalId = this.selectedProfessional != "-1" ? parseInt(this.selectedProfessional) : null;
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.firstName = this.firstName;
        requestAppointment.lastName = this.lastName;
        requestAppointment.address = this.address;
        requestAppointment.phoneNumber = this.phoneNumber;
        requestAppointment.dni = this.dni;
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
        this.requestedAppointmentsPerProfessional.forEach(element => {
            doc.setDrawColor(255, 0, 0);
            doc.line(10, yName-8, 200, yName-8);            
            doc.text("Professional:",10,yName);
            doc.text(element.professionalFirstName,30,yName);
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