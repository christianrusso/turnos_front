import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HairdressingAppointmentService } from '../../service/hairdressing-appointment.service';
import { AppointmentFilter } from '../../model/appointment-filter.class';
import { RequestedHairdressingAppointments } from '../../model/requested-hairdressing-appointments.class';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { HairdressingSpecialtyService } from '../../service/hairdressing.specialty.service';
import { HairdressingSubspecialtyService } from '../../service/hairdressing.subspecialty.service';
import { IdFilter } from '../../model/id-filter.class';
import { HairdressingProfessionalService } from '../../service/hairdressing.professional.service';
import { HairdressingProfessionalFilter } from '../../model/hairdressing-professional-filter.class';
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
import { Logo } from '../../model/logoForPdf';
import { } from 'googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';
import { ClientFilter } from '../../model/client-filter.class';
declare var jsPDF: any; // Important

import { TouchSequence, FileDetector } from 'selenium-webdriver';
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
    public selectedSubspecialty: number;
    public professionalOptions: Array<Select2OptionData>;
    public appointments = new Array<string>();
    public professionalOption: string;
    public professionalSpecialties = [];
    public professionalSubspecialties = [];
    public professionalData;

    public firstName: string;
    public lastName: string;
    public address: string;
    public phoneNumber: string;
    public dni: string;
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

    public searchClientFilter = new ClientFilter();

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('assets/calendario.js');
    }

    public days: Array<string>;
    public months: Array<string>;
    public currentDate: Date;
    public currentMonday: Date;
    public currentSunday: Date;

    public isDay = false;

    options: DatepickerOptions = {
        displayFormat: 'DD/MM/YYYY',
        locale: esLocale,
    }

    public professionalDataToBlock;
    public professionalSubspecialtiesToBlock: Array<Select2OptionData>;
    public professionalSubspecialtyToBlock;
    public professionalSubspecialtyToUnblock;
    public professionalSubspecialitiesMessage = [];

    constructor (
        private appointmentService: HairdressingAppointmentService,
        private specialtyService: HairdressingSpecialtyService,
        private subspecialtyService: HairdressingSubspecialtyService,
        private professionalService: HairdressingProfessionalService,
        private patientService: HairdressingPatientService,
        private clientService: ClientService,
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
        $("a#empleado-panel").removeClass('active');
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
                    this.address = place.address_components[1].long_name + " " + place.address_components[0].long_name + " " + place.address_components[2].long_name + " " + place.address_components[4].long_name;

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

    getAllProfessionals() {
        this.loaderService.show();
        this.professionalService.getAllProfessionalsForSelect().subscribe(res => {
            this.professionalOptions = res;
            this.loaderService.hide();
        });
    }

    getAllClientsNonPatients() {
        this.loaderService.show();
        this.clientService.getAllClientsNonHairdressingPatientsByFilter(this.searchClientFilter).subscribe(res => {
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

        this.getBlocked();
    }

    previousDay(): void {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.getCurrentDateAppointments();
        this.getBlocked();
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

        console.log("aca va el filter.day");
        console.log(filter.day);
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
        this.professionalOption = ''
        this.selectedHour = null;
        this.selectedDate = new Date(this.currentDate);
        this.appointments = [];

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

        this.selectedHour = null;
        this.selectedDate = new Date(this.currentDate);
        this.appointments = [];
    }

    hideRequestAppointment() {
        $(".modal-agregar-turno").fadeOut();
    }

    dateChange(selection) {
        this.selectedProfessional = "";
        this.professionalOption = "";
        this.professionalSpecialties = [{}];
        this.professionalSubspecialties = [{}];
        this.appointments = [];
        this.selectedSubspecialty = null;
    }

    professionalChange(selection) {
        this.loaderService.show();
        this.selectedProfessional = selection.value;
        let filter = new HairdressingProfessionalFilter();
        filter.id = selection.value;
        this.professionalSpecialties = [{}];
        this.professionalSubspecialties = [{}];
        this.appointments = [];
        this.selectedSubspecialty = null;
        let repeated = [];
        this.professionalService.getAllProfessionalsByFilter(filter).subscribe(res => {
            this.professionalData = res;
            res.forEach(doc =>{
                doc.subspecialties.forEach(esp =>{
                    if (repeated.indexOf(esp.specialtyId) === -1) {
                        repeated.push(esp.specialtyId);
                        this.professionalSpecialties.push(
                            {
                                specialtyId: esp.specialtyId,
                                specialtyDescription: esp.specialtyDescription
                            }
                        );
                    }
                })
            });
            this.loaderService.hide();
        });
    }

    professionalEspChange(selection) {
        this.professionalSubspecialties = [{}];
        this.selectedSubspecialty = null;
        this.appointments = [];
        this.professionalData.forEach(doc => {
            doc.subspecialties.forEach(esp => {
                if (esp.specialtyId == selection.value) {
                    this.professionalSubspecialties.push(
                        {
                            id: esp.subspecialtyId,
                            desc: esp.subspecialtyDescription
                        }
                    );
                }
            });
        });
    }

    professionalSubespChange(selection) {
        this.loaderService.show();
        let appointment = new GetHairdressingAppointment();
        appointment.subspecialtyId = selection.value;
        appointment.professionalId = parseInt(this.selectedProfessional);
        appointment.day = this.selectedDate;
        this.appointments = [];
        this.selectedSubspecialty = selection.value;
        this.appointmentService.getAllAvailablesForDay(appointment).subscribe(res => {
            res.forEach(appointment => {
                this.appointments.push(this.getHour(appointment));
            });
            this.loaderService.hide();
        });
    }

    dayChange(selection) {
        this.professionalOption = '';
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
        let requestAppointment = new RequestHairdressingAppointmentPatient();
        requestAppointment.professionalId = parseInt(this.selectedProfessional);
        requestAppointment.day = this.selectedDate.toJSON();
        requestAppointment.time = this.selectedHour;
        requestAppointment.patientId = this.selectedPatient.id;
        requestAppointment.subspecialtyId = this.selectedSubspecialty;

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
        requestAppointment.subspecialtyId = this.selectedSubspecialty;

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
        requestAppointment.subspecialtyId = this.selectedSubspecialty;

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
        this.isDay = true;
        $(".semana-calendario").hide();
        $(".dia-calendario").show();

        this.getBlocked();
    }

    showCalendarWeek() {
        this.isDay = false;
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
        this.appointmentToCancel.comment = "";
        $(".modal-nueva-especialidad").show();
    }

    closeCancelAppointment() {
        $(".modal-nueva-especialidad").hide();
    }

    cancelAppointment() {
        this.appointmentService.cancelAppointmentByHairdressing(this.appointmentToCancel).subscribe(res => {
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
        this.requestedAppointmentsPerProfessional.forEach(element => {
           rows = [];
            if(element.requestedAppointmentsPerHour.length>0){
                element.requestedAppointmentsPerHour.forEach(paciente => {
                    paciente.appointments.forEach(hour => {
                        var fecha = new Date(hour.hour);
                       rows.push([hour.patient,fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear(),fecha.getHours()+":"+(fecha.getMinutes()<10?'0':'') + fecha.getMinutes()])
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
                var columns2 = [element.professionalFirstName + " " + element.professionalLastName];
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
            this.isPatientUserFirstStep();
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
    }

    openLockModal(id) {
        this.getProfessionalByFilter(id);
        $(".modal-bloquear-especialidad").fadeIn();
    }

    getProfessionalByFilter(id) {
        this.loaderService.show();
        this.professionalDataToBlock = null;
        let myData = [];

        const filter = new HairdressingProfessionalFilter();
        filter.id = id;

        this.professionalService.getAllProfessionalsByFilter(filter).subscribe(res => {
            this.professionalDataToBlock = res;
            for (let i = 0; i < this.professionalDataToBlock[0].subspecialties.length; i++) {
                myData.push(
                    {
                        id: this.professionalDataToBlock[0].subspecialties[i].subspecialtyId.toString(),
                        text: this.professionalDataToBlock[0].subspecialties[i].subspecialtyDescription
                    }
                );
            }
            this.professionalSubspecialtiesToBlock = myData;
            this.loaderService.hide();
        });
    }

    blockSubspecialty() {
        this.loaderService.show();

        const filter = new HairdressingProfessionalFilter();
        filter.id = this.professionalDataToBlock[0].id;
        filter.subspecialtyId = this.professionalSubspecialtyToBlock;
        filter.day = this.currentDate.toJSON();

        this.professionalService.blockDay(filter).subscribe(res => {
            this.toastrService.success('Subespecialidad del profesional ' + this.professionalDataToBlock[0].firstName + ' ' + this.professionalDataToBlock[0].lastName + ' bloqueada para el día indicado.');
            this.loaderService.hide();
            this.professionalSubspecialtyToBlock = null;
            this.getBlocked();
            $(".modal-bloquear-especialidad").fadeOut();
        });
    }

    unblockSubspecialty() {
        this.loaderService.show();

        const filter = new HairdressingProfessionalFilter();
        filter.id = this.professionalDataToBlock[0].id;
        filter.subspecialtyId = this.professionalSubspecialtyToUnblock;
        filter.day = this.currentDate.toJSON();

        this.professionalService.unblockDay(filter).subscribe(res => {
            this.toastrService.success('Subespecialidad del profesional ' + this.professionalDataToBlock[0].firstName + ' ' + this.professionalDataToBlock[0].lastName + ' desbloqueada para el día indicado.');
            this.loaderService.hide();
            this.professionalSubspecialtyToUnblock = null;
            this.getBlocked();
            $(".modal-bloquear-especialidad").fadeOut();
        });
    }

    getBlocked() {
        this.loaderService.show();

        this.professionalSubspecialitiesMessage = [];

        const filter = new HairdressingProfessionalFilter();
        filter.day = this.currentDate.toJSON();

        this.professionalService.getBlocked(filter).subscribe(res => {
            for (let i = 0; i < res.length; i++) {
                if(typeof this.professionalSubspecialitiesMessage[res[i].hairdressingProfessional] == 'undefined') {
                    this.professionalSubspecialitiesMessage[res[i].hairdressingProfessional] = "";
                }
                if (this.professionalSubspecialitiesMessage[res[i].hairdressingProfessional] == "") {
                    this.professionalSubspecialitiesMessage[res[i].hairdressingProfessional] = res[i].subspecialtyDescription;
                } else {
                    this.professionalSubspecialitiesMessage[res[i].hairdressingProfessional] += ", " + res[i].subspecialtyDescription;
                }
            }
            this.loaderService.hide();
            console.log(res);
        });
    }
}