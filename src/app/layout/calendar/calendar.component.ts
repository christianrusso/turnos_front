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
declare var jsPDF: any; // Important
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

    constructor(
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

    medicalInsuranceChange(selection) {
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

    getMondayOfWeek(date: Date): Date {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
        );
    }

    getSundayOfWeek(date: Date): Date {
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

    getCurrentWeekAppointments(): void {
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
    dowloadPdf() {
        var doc = new jsPDF('p', 'mm', 'a4');

        var myImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABngAAAJOCAYAAACUbQkIAAAACXBIWXMAAC4jAAAuIwF4pT92AAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wOS0yM1QxNDozNDozMS0wMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDktMjNUMTQ6MzU6MTYtMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTgtMDktMjNUMTQ6MzU6MTYtMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MmViYmI1NGEtYzA5Yi1lNTQ2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";
        doc.setFillColor("#454EDB");
        doc.rect(0, 0, 320, 39, "F");
        doc.addImage(myImage, 'JPEG', 80, 10, 40, 14);

        var columns = ["PACIENTE", "FECHA", "HORA"];
        var rows = [
            ["Nelson", "15/10/2018", "13:00"],
            ["Nelson", "15/10/2018", "13:00"],

        ];
        var xtest = 42.6;
        var ytest = 34;
        var block = 0;
        this.requestedAppointmentsPerDoctor.forEach(element => {
            if (block > 44) {
                doc.addPage();
                doc.setFillColor("#454EDB");
                doc.rect(0, 0, 320, 39, "F");
                doc.addImage(myImage, 'JPEG', 80, 10, 40, 14);
            }
            //medico
            var columns2 = [element.doctorFirstName + " " + element.doctorLastName];
            doc.autoTable(columns2, [], {
                styles: {
                    valign: 'middle',
                    halign: 'center',
                    lineColor: "black",
                    lineWidth: 0.2,
                    fillColor: "#EAECF2",
                    fontSize: 13,
                },
                theme: 'plain', // 'striped', 'grid' or 'plain'
                margin: { top: ytest },
            });
   
            //listado
            doc.autoTable(columns, rows, {
                styles: {
                    valign: 'middle', // top, middle, bottom
                    halign: 'center', // left, center, right
                    lineColor: "black",
                    lineWidth: 0.2,
                    fontSize: 12,
                },

                theme: 'plain', // 'striped', 'grid' or 'plain'
                margin: { top: xtest },

            });
          
            block =100;
            element.requestedAppointmentsPerHour.forEach(perHour => {
                perHour.appointments.forEach(appoint => {
                    console.log(appoint);
                    console.log("hola");

                });
            });
        });

        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
        //doc.save('test.pdf');
    }
}