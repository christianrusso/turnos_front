import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
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
import { Logo } from '../../model/logoForPdf';
import { } from 'googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';

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
    public doctorOption: string;

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

    public isPatientStep = 1;
    public isPatientNuevoStep = 1;
    public isPatientUserStep = 1;

    public appointmentToCancel = new CancelAppointment();

    public week = new Array<WeekDay>();
    public logoForPdf=Logo;

    @ViewChild("search")
    public searchElementRef: ElementRef;
    public latitude: number;
    public longitude: number;
    public zoom: number;
    public invalidPhone: boolean = false;

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../panel/assets/calendario.js');
    }

    public days: Array<string>;
    public months: Array<string>;
    public currentDate: Date;
    public currentMonday: Date;
    public currentSunday: Date;

    options: DatepickerOptions = {
        displayFormat: 'DD/MM/YYYY',
        locale: esLocale,
    }

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
        private toastrService: ToastrService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
        super();
        $("a#home-panel").removeClass('active');
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

    ngOnInit() {
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        this.setCurrentPosition();
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });

            autocomplete.setComponentRestrictions(
                {'country': ['ar']}
            );

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                    this.address = place.address_components[1].long_name + " " + place.address_components[0].long_name + " " + place.address_components[2].long_name + " " + place.address_components[4].long_name +
                        " " + place.address_components[5].long_name;

                });
            });
        });
    }

    setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
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
            date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1),
            -3,
            0
        );
    }

    getSundayOfWeek(date: Date) : Date {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay() + (date.getDay() == 0 ? 0 : 7),
            20,
            59
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
        $(".paciente-cluster").fadeOut();
        $(".cliente-cluster").fadeOut();
        $(".noexiste-cluster").fadeOut();
        $("a#paciente-turno").removeClass('activeTurno');
        $("a#cliente-turno").removeClass('activeTurno');
        $("a#noexiste-turno").removeClass('activeTurno');

        $(".modal-agregar-turno").fadeIn();
        this.isPatientStep = 1;
        this.firstStepStyles();

        this.isPatientNuevoStep = 1;
        this.firstStepNuevoStyles();

        this.isPatientUserStep = 1;
        this.firstStepUserStyles();

        this.selectedClient = null;
        this.selectedPatient = null;
        this.address = null;
        this.firstName = null;
        this.lastName = null;
        this.phoneNumber = null;
        this.dni = null;

        this.doctorOption = '';
        this.selectedHour = null;
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

    dayChange(selection) {
        this.doctorOption = '';
        this.selectedHour = null;
        this.appointments = [];
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
            this.appointmentToCancel.comment = "";
            this.closeCancelAppointment();
            this.reloadPage();
        });
    }

    dowloadPdf() {
        var doc = new jsPDF('p', 'mm', 'a4');
        var myImage =this.logoForPdf.logo;
        doc.setFillColor("#454EDB");
        doc.rect(0, 0, 320, 39, "F");
        doc.addImage(myImage, 'JPEG', 80, 10, 40, 14);
        var columns = ["PACIENTE", "FECHA", "HORA"];
        var rows = [];
        var block = 0;
        this.requestedAppointmentsPerDoctor.forEach(element => {
           rows = [];
            if(element.requestedAppointmentsPerHour.length>0){
                element.requestedAppointmentsPerHour.forEach(paciente => {
                    paciente.appointments.forEach(hour => {
                        var fecha = new Date(hour.hour);
                       rows.push([hour.patient,fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear(),fecha.getHours()+":"+fecha.getMinutes()])
                    });                                
                });
               // rows.push(row2);   
                if (block > 44) {
                    doc.addPage();
                    doc.setFillColor("#454EDB");
                    doc.rect(0, 0, 320, 39, "F");
                    doc.addImage(myImage, 'JPEG', 80, 10, 40, 14);
                }
                //medico
                var columns2 = [element.doctorFirstName + " " + element.doctorLastName];
                doc.autoTable(columns2, [], {styles: {valign: 'middle',halign: 'center',lineColor: "black",lineWidth: 0.2,fillColor: "#EAECF2",fontSize: 13,},
                    theme: 'plain', 
                    margin: { top: 34},
                });
                //listado
                doc.autoTable(columns, rows, {styles: {valign: 'middle',halign: 'center', lineColor: "black",lineWidth: 0.2,fontSize: 12,}, 
                    theme: 'plain', 
                    margin: { top: 42.6 },
                });
                block =100;
            }                 
        });
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
        //doc.save('test.pdf');
    }

    isPatientNextStep() {
        if (this.isPatientStep == 1) {
            if (this.selectedPatient.dni != "") {
                this.isPatientStep = 2;
                this.secondStepStyles();
            }
        } else if (this.isPatientStep == 2) {
            this.isPatientStep = 1;
            this.firstStepStyles();
        }
    }

    isPatientNuevoNextStep() {
        if (this.isPatientNuevoStep == 1) {
            if (this.phoneNumber.length < 8 || this.phoneNumber.length > 12) {
                this.invalidPhone = true;
                return;
            } else {
                this.invalidPhone = false;
            }
            if (this.firstName != "" && this.firstName != null) {
                this.isPatientNuevoStep = 2;
                this.secondStepNuevoStyles();
            }
        } else if (this.isPatientNuevoStep == 2) {
            this.isPatientNuevoStep = 1;
            this.firstStepNuevoStyles();
        }
    }

    isPatientUserNextStep() {
        if (this.isPatientUserStep == 1) {
            if (this.firstName != "" && this.firstName != null) {
                this.isPatientUserStep = 2;
                this.secondStepUserStyles();
            }
        } else if (this.isPatientUserStep == 2) {
            if (this.medicalPlan != "" && this.medicalPlan != null) {
                this.isPatientUserStep = 3;
                this.thirdStepUserStyles();
            }
        }
    }

    isPatientUserFirstStep() {
        this.isPatientUserStep = 1;
        this.firstStepUserStyles();
    }

    isPatientUserSecondStep() {
        if (this.firstName != "" && this.firstName != null) {
            this.isPatientUserStep = 2;
            this.secondStepUserStyles();
        }
    }

    secondStepStyles() {
        (document.querySelector('#firstStep') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#firstStepParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#firstStep') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#firstStepParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStep') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#secondStep') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#secondStepParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#secondStepParent') as HTMLElement).classList.add('borderSelected');
    }

    firstStepStyles() {
        (document.querySelector('#firstStep') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#firstStep') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#firstStepParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#firstStepParent') as HTMLElement).classList.add('borderSelected');
        (document.querySelector('#secondStep') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#secondStep') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#secondStepParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepParent') as HTMLElement).classList.remove('borderSelected');
    }



    secondStepNuevoStyles() {
        (document.querySelector('#firstStepNuevo') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#firstStepNuevoParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#firstStepNuevo') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#firstStepNuevoParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepNuevo') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#secondStepNuevo') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#secondStepNuevoParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#secondStepNuevoParent') as HTMLElement).classList.add('borderSelected');
    }

    firstStepNuevoStyles() {
        (document.querySelector('#firstStepNuevo') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#firstStepNuevo') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#firstStepNuevoParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#firstStepNuevoParent') as HTMLElement).classList.add('borderSelected');
        (document.querySelector('#secondStepNuevo') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#secondStepNuevo') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#secondStepNuevoParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepNuevoParent') as HTMLElement).classList.remove('borderSelected');
    }


    secondStepUserStyles() {
        (document.querySelector('#firstStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#firstStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.add('borderSelected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.add('borderUnselected');
    }

    thirdStepUserStyles() {
        (document.querySelector('#firstStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#firstStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.add('borderSelected');
    }

    firstStepUserStyles() {
        (document.querySelector('#firstStepUser') as HTMLElement).classList.remove('circleSecond');
        (document.querySelector('#firstStepUser') as HTMLElement).classList.add('circleFirst');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.remove('borderUnselected');
        (document.querySelector('#firstStepUserParent') as HTMLElement).classList.add('borderSelected');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#secondStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.add('borderUnselected');
        (document.querySelector('#secondStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.remove('circleFirst');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.remove('borderSelected');
        (document.querySelector('#thirdStepUser') as HTMLElement).classList.add('circleSecond');
        (document.querySelector('#thirdStepUserParent') as HTMLElement).classList.add('borderUnselected');
    }
}