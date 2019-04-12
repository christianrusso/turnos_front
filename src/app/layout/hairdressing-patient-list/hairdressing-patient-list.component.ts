import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HairdressingPatient } from '../../model/hairdressing-patient.class';
import { PatientFicha } from '../../model/patient-ficha.class';
import { HairdressingPatientService } from '../../service/hairdressing-patient.service';
import { HairdressingPatientFilter } from '../../model/hairdressing-patient-filter.class';
import { Client } from '../../model/client.class';
import { ClientService } from '../../service/client.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { ClientFilter } from '../../model/client-filter.class';
import { } from 'googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {PatientService} from "../../service/patient.service";
import {PatientFilter} from "../../model/patient-filter.class";
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';
import { SearchUserFilter } from '../../model/searchuser.filter.class';
import { SearchUser } from '../../model/searchuser.class';

@Component({
    selector: 'app-hairdressing-patient-list',
    templateUrl: './hairdressing-patient-list.component.html',
    styleUrls: ['./hairdressing-patient-list.component.css']
})

export class HairdressingPatientListComponent extends BaseComponent implements AfterViewInit {
    
    public patients = new Array<HairdressingPatient>();
    public selectedPatientName = '';
    public selectedPatient: HairdressingPatient;

    public clients = new Array<Client>();
    public selectedClient: Client;

    // Patient 
    public firstName: string;
    public lastName: string;
    public address: string;
    public username: string;
    public invalidPhone: boolean = false;
    
    public password: string;

    public step = 0;

    @ViewChild("search")
    public searchElementRef: ElementRef;
    @ViewChild("searchEdit")
    public searchElementRefEdit: ElementRef;
    public latitude: number;
    public longitude: number;
    public zoom: number;

    public searchClientFilter = new ClientFilter();

    public searchUserFilter = new SearchUserFilter();
    public searchUser = new SearchUser();

    public searchDescription: string;

    public pacienteFicha = [];
    public selectedDate: Date;
    public addDescription: string;
    public isEditing = false;
    public editingId: number;
    public previousDate;

    options: DatepickerOptions = {
        displayFormat: 'DD/MM/YYYY',
        locale: esLocale,
        maxDate: new Date(Date.now()),
        useEmptyBarTitle: false
    }

    fichaOpenForm = false;

    public pageNumber = 1;

    constructor(
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
        $("a#pacientes-panel").addClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#empleado-panel").removeClass('active');
        this.getAllPatientsByFilter();
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
            let autocompleteEdit = new google.maps.places.Autocomplete(this.searchElementRefEdit.nativeElement, {
                types: ["address"]
            });

            autocomplete.setComponentRestrictions(
                {'country': ['ar']}
            );
            autocompleteEdit.setComponentRestrictions(
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

            autocompleteEdit.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocompleteEdit.getPlace();
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

    private reloadPage(){
        this.getAllPatientsByFilter();
        this.getAllClientsNonPatients();
    }

    getAllClientsNonPatients() {
        this.clientService.getAllClientsNonHairdressingPatientsByFilter(this.searchClientFilter).subscribe(res => {
            this.clients = res;
        });
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('assets/pacientes.js');
    }

    getAllPatients() {
        this.loaderService.show();
        this.patientService.getAllPatients().subscribe(res => {
            this.patients = res;
            this.loaderService.hide();
        });
    }

    getSearchUser() {
        $(".existe-cluster").fadeOut();
        $(".cliente-cluster").fadeOut();
        $(".noexiste-cluster").fadeOut();
        this.patientService.searchUser(this.searchUserFilter).subscribe(res => {
            this.searchUser = res;
        
            if(this.searchUser.isPatient){ //ya es paciente
                $(".existe-cluster").fadeIn();
            }else if(this.searchUser.isClient){ //no paciente y cliente
                this.firstName = this.searchUser.firstName;
                this.lastName = this.searchUser.lastName;
                this.address = this.searchUser.address;
                this.username = this.searchUser.username;
                this.selectedClient = new Client();
                this.selectedClient.id = this.searchUser.clientId;
                this.showClientTab();  
            }else{ //no es nada
                this.showNoClientTab();                  
            }
        });
        
    }

    getAllPatientsByFilter() {
        this.loaderService.show();
        const filter = new HairdressingPatientFilter();
        this.patientService.getAllPatientsByFilter(filter).subscribe(res => {
            this.patients = res
            this.loaderService.hide();

            if (this.patients.length == 0) {
                $(".modal-informacion").fadeIn();
            }
        });
    }

    closeInformation() {
        $(".modal-informacion").fadeOut();
    }

    setSelectedPatient(index: number) {
        this.selectedPatient = this.patients[index];
        this.selectedPatientName = this.selectedPatient.firstName + ' ' + this.selectedPatient.lastName;
        $(".modal-borrar-paciente").fadeIn();
    }

    cancelRemovePatient() {
        $(".modal-borrar-paciente").fadeOut();
    }

    removeSelectedPatient() {
        this.removePatient(this.selectedPatient);
    }

    removePatient(patient: HairdressingPatient) {
        this.loaderService.show();
        this.patientService.remove(patient).subscribe(res => {
            $(".modal-borrar-paciente").fadeOut();
            this.getAllPatients();
        });
    }

    cleanPatient() {
        this.firstName = "";
        this.lastName = "";
        this.address = "";
        this.username = "";
        this.password = "";
        this.searchClientFilter.email = "";
        this.searchClientFilter.dni = "";
        this.getAllClientsNonPatients();
    }

    showAddPatient(){
        this.cleanPatient();
        $(".modal-agregar-paciente").fadeIn();
        $(".noexiste-cluster").fadeOut();
        $(".existe-cluster").fadeOut();
        $(".cliente-cluster").fadeOut();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").removeClass('activeTurno');
    }

    

    hideAddPatient(){
        $(".modal-agregar-paciente").fadeOut();
    }

    showClientTab() {
        $(".noexiste-cluster").fadeOut();
        $(".cliente-cluster").fadeIn();
        $("#cliente-turno").addClass('activeTurno'); 
        $("#noexiste-turno").removeClass('activeTurno');
        this.step = 1;
        //this.firstStepStyles();
    }

    showNoClientTab() {
        this.step == 1;
        $(".cliente-cluster").fadeOut();
        $(".noexiste-cluster").fadeIn();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").addClass('activeTurno');
    }

    addPatientForNonClient() {
        /*if (this.phoneNumber.length < 8 || this.phoneNumber.length > 12) {
            this.invalidPhone = true;
            return;
        } else {
            this.invalidPhone = false;
        }*/

        this.loaderService.show();
        let patient = new HairdressingPatient();
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.username = this.username;
        patient.password = this.password;

        this.patientService.addForNonClient(patient).subscribe(ok => {
            $(".modal-agregar-paciente").fadeOut();
            this.toastrService.success('Cliente creado correctamente.');
            this.toastrService.success('Cliente convertido en paciente correctamente.');
            this.reloadPage();
        });
    }

    addPatientForClient(){
        let patient = new HairdressingPatient();
        patient.clientId = this.selectedClient.id;
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.username = this.username;

        this.patientService.add(patient).subscribe(ok => {
            $(".modal-agregar-paciente").fadeOut();
            this.toastrService.success('Cliente convertido en paciente correctamente.');
            this.reloadPage();
        });
    }

    selectedClientChange(selectedClient) {
        this.selectedClient = selectedClient;

        this.firstName = this.selectedClient.firstName;
        this.lastName = this.selectedClient.lastName;
        this.address = this.selectedClient.address;
        this.username = this.selectedClient.username;
        
    }

    // Edit Patient
    showEditPatient(patientIndex: number) {
        this.selectedPatient = this.patients[patientIndex];
        this.firstName = this.selectedPatient.firstName;
        this.lastName = this.selectedPatient.lastName;
        this.address = this.selectedPatient.address;
        this.username = this.selectedPatient.username;
        $(".modal-editar-paciente").fadeIn();
    }

    showPacienteFicha(index: number) {
        $(".modal-paciente").fadeIn();

        if (index != -1) {
            this.selectedPatient = this.patients[index];
        }

        this.loaderService.show();

        let patient = new PatientFilter();
        patient.Id = this.selectedPatient.id;

        this.patientService.getMedicalRecords(patient).subscribe(res => {
            this.pacienteFicha = res;

            this.loaderService.hide();
        });
    }

    deletePacienteFicha(index: number) {
        this.loaderService.show();

        let patient = new PatientFilter();
        patient.Id = this.pacienteFicha[index].id;

        this.patientService.removeMedicalRecord(patient).subscribe(res => {
            this.pacienteFicha.splice(index, 1);

            this.loaderService.hide();
        });
    }

    addPacienteFicha() {
        if (!this.isEditing) {
            this.loaderService.show();

            let patient = new PatientFicha();
            patient.id = this.selectedPatient.id;
            patient.description = this.addDescription;
            patient.datetime = this.selectedDate.toJSON();

            this.patientService.addMedicalRecord(patient).subscribe(res => {
                this.addDescription = "";
                this.showPacienteFicha(-1);
            });
        } else {
            this.editFicha();
        }
    }

    editPacienteFicha(index: number) {
        this.addDescription = this.pacienteFicha[index].description;
        this.previousDate = this.selectedDate;
        this.selectedDate = this.pacienteFicha[index].dateTime;
        this.editingId = this.pacienteFicha[index].id;
        this.isEditing = true;
        if ($("#newFicha").not(":visible")) {
            $("#newFicha").show();
            $("#addFicha").html("VER TODAS LAS FICHAS");
            this.fichaOpenForm = true;
        }
    }

    editFicha() {
        this.loaderService.show();

        let patient = new PatientFicha();
        patient.id = this.editingId;
        patient.description = this.addDescription;
        if (typeof this.selectedDate !== "object") {
            patient.datetime = String(this.selectedDate);
        } else {
            patient.datetime = this.selectedDate.toJSON();
        }
        this.selectedDate = this.previousDate;
        this.previousDate = null;

        this.isEditing = false;
        this.editingId = null;

        this.patientService.editMedicalRecord(patient).subscribe(res => {
            this.addDescription = "";
            this.showPacienteFicha(-1);
        });
    }

    hideEditPatient(){
        $(".modal-editar-paciente").fadeOut();
    }

    editPatientForClient(){
        this.loaderService.show();
        let patient = new HairdressingPatient();
        patient.id = this.selectedPatient.id;
        patient.clientId = this.selectedPatient.clientId;
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.username = this.username;

        this.patientService.edit(patient).subscribe(ok => {
            $(".modal-editar-paciente").fadeOut();
            this.toastrService.success('Paciente editado correctamente.');
            this.reloadPage();
        });
    }

    nextStep() {
        if (this.step == 1) {
            if (this.username != "") {
                this.step = 2;
                this.secondStepStyles();
            }
        } else if (this.step == 2 || this.step == 0) {
            this.step = 1;
            this.firstStepStyles();
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

    searchPatients() {
        const filter = new HairdressingPatientFilter();
        filter.Text = this.searchDescription;
        this.patientService.getAllPatientsByFilter(filter).subscribe(res => {
            this.patients = res;
        });
    }

    fichaOpenClose() {
        if ($("#newFicha").is(":visible")) {
            $("#newFicha").hide();
            $("#addFicha").html("AGREGAR FICHA NUEVA");
            this.fichaOpenForm = false;
        } else {
            $("#newFicha").show();
            $("#addFicha").html("VER TODAS LAS FICHAS");
            this.fichaOpenForm = true;
        }
    }
}
