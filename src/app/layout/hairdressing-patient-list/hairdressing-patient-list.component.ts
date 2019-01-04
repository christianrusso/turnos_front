import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HairdressingPatient } from '../../model/hairdressing-patient.class';
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
    public phoneNumber: string;
    public invalidPhone: boolean = false;
    public dni: string;
    public email: string;
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
        await this.loadScript('../assets/pacientes.js');
    }

    getAllPatients() {
        this.loaderService.show();
        this.patientService.getAllPatients().subscribe(res => {
            this.patients = res;
            this.loaderService.hide();
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
        this.phoneNumber = "";
        this.dni = "";
        this.email = "";
        this.password = "";
        this.searchClientFilter.email = "";
        this.searchClientFilter.dni = "";
        this.getAllClientsNonPatients();
    }

    showAddPatient(){
        this.cleanPatient();
        $(".modal-agregar-paciente").fadeIn();
        $(".noexiste-cluster").fadeOut();
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
        this.firstStepStyles();
    }

    showNoClientTab() {
        this.step == 1;
        $(".cliente-cluster").fadeOut();
        $(".noexiste-cluster").fadeIn();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").addClass('activeTurno');
    }

    addPatientForNonClient() {
        if (this.phoneNumber.length < 8 || this.phoneNumber.length > 12) {
            this.invalidPhone = true;
            return;
        } else {
            this.invalidPhone = false;
        }

        this.loaderService.show();
        let patient = new HairdressingPatient();
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;
        patient.email = this.email;
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
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;

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
        this.phoneNumber = this.selectedClient.phoneNumber;
        this.dni = this.selectedClient.dni;
    }

    // Edit Patient
    showEditPatient(patientIndex: number) {
        this.selectedPatient = this.patients[patientIndex];
        this.firstName = this.selectedPatient.firstName;
        this.lastName = this.selectedPatient.lastName;
        this.address = this.selectedPatient.address;
        this.phoneNumber = this.selectedPatient.phoneNumber;
        this.dni = this.selectedPatient.dni;
        $(".modal-editar-paciente").fadeIn();
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
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;

        this.patientService.edit(patient).subscribe(ok => {
            $(".modal-editar-paciente").fadeOut();
            this.toastrService.success('Paciente editado correctamente.');
            this.reloadPage();
        });
    }

    nextStep() {
        if (this.step == 1) {
            if (this.dni != "") {
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
}
