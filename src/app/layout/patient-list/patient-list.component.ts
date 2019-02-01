import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Patient } from '../../model/patient.class';
import { PatientFicha } from '../../model/patient-ficha.class';
import { PatientService } from '../../service/patient.service';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { PatientFilter } from '../../model/patient-filter.class';
import { MedicalInsuranceService } from '../../service/medicalInsurance.service';
import { Client } from '../../model/client.class';
import { ClientService } from '../../service/client.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { IdFilter } from '../../model/id-filter.class';
import { MedicalPlanService } from '../../service/medicalPlan.service';
import { ClientFilter } from '../../model/client-filter.class';
import { } from 'googlemaps';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';

@Component({
    selector: 'app-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrls: ['./patient-list.component.css'],
})

export class PatientListComponent extends BaseComponent implements AfterViewInit {
    
    public patients = new Array<Patient>();
    public selectedPatientName = '';
    public selectedPatient: Patient;
    
    public medicalInsuranceFilterOptions: Array<Select2OptionData>;
    public medicalInsuranceFilter: string;

    public clients = new Array<Client>();
    public selectedClient: Client;

    // Patient 
    public firstName: string;
    public lastName: string;
    public address: string;
    public phoneNumber: string;
    public invalidPhone: boolean = false;
    public dni: string;
    public medicalInsuranceOptions: Array<Select2OptionData>;
    public medicalInsurance: string;
    public medicalPlanOptions: Array<Select2OptionData>;
    public medicalPlan: string;
    public email: string;
    public password: string;

    public searchClientFilter = new ClientFilter();

    public addPatientEnable = false;

    public step = 0;

    @ViewChild("search")
    public searchElementRef: ElementRef;
    public latitude: number;
    public longitude: number;
    public zoom: number;

    public searchDescription;

    public pacienteFicha = [];
    public selectedDate: Date;
    public addDescription: string;
    public isEditing = false;
    public editingId: number;

    options: DatepickerOptions = {
        displayFormat: 'DD/MM/YYYY',
        locale: esLocale,
        maxDate: new Date(Date.now()),
        useEmptyBarTitle: false
    }

    constructor(
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
        $("a#pacientes-panel").addClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        $("a#empleado-panel").removeClass('active');
        this.getAllPatientsByFilter();
        this.getAllMedicalInsurance();
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

    private reloadPage(){
        this.getAllPatientsByFilter();
        this.getAllMedicalInsurance();
        this.getAllClientsNonPatients();
    }

    private getAllMedicalPlansOfInsurance() {
        const filter = new IdFilter();
        filter.id = parseInt(this.medicalInsurance);
        this.medicalPlanService.getAllMedicalPlansOfInsuranceForSelect(filter).subscribe(res => {
            this.medicalPlanOptions = res;
            this.loaderService.hide();
        })
    }

    getAllClientsNonPatients() {
        this.clientService.getAllClientsNonPatientsByFilter(this.searchClientFilter).subscribe(res => {
            this.clients = res;
        });
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/pacientes.js');
    }
    
    medicalInsuranceFilterChange(selection){
        this.loaderService.show();
        this.medicalInsuranceFilter = selection.value;
        this.getAllPatientsByFilter();
    }
    
    medicalInsuranceChange(selection){
        this.loaderService.show();
        this.medicalInsurance = selection.value;
        this.getAllMedicalPlansOfInsurance();
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
        const filter = new PatientFilter();
        filter.medicalInsuranceId = this.medicalInsuranceFilter != "-1" ? parseInt(this.medicalInsuranceFilter) : null;
        this.patientService.getAllPatientsByFilter(filter).subscribe(res => {
            this.patients = res
            this.loaderService.hide();

            if (isNaN(filter.medicalInsuranceId) && this.patients.length == 0) {
                $(".modal-informacion").fadeIn();
            }
        });
    }

    closeInformation() {
        $(".modal-informacion").fadeOut();
    }

    getAllMedicalInsurance(): any {
        this.loaderService.show();
        this.medicalInsuranceService.getAllMedicalInsurancesForSelect().subscribe(res => {
            this.addPatientEnable = res.length > 1;
            this.medicalInsuranceFilterOptions = res;
            this.medicalInsuranceOptions = res.slice(0);
            this.medicalInsuranceOptions.shift();
            this.medicalInsuranceFilter = "-1";
            this.medicalInsurance = "-1";
            this.loaderService.hide();
        });;
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

    removePatient(patient: Patient) {
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
        this.medicalInsurance = "-1";
        this.medicalPlan = "-1";
        this.email = "";
        this.password = "";
        this.searchClientFilter.email = "";
        this.searchClientFilter.dni = "";
        this.getAllClientsNonPatients();
    }

    showAddPatient(){
        this.cleanPatient();
        this.firstStepStyles();
        $(".modal-agregar-paciente").fadeIn();
        $(".cliente-cluster").fadeIn();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").removeClass('activeTurno');
        this.step = 0;
    }

    hideAddPatient(){
        $(".modal-agregar-paciente").fadeOut();
    }

    showClientTab() {
        $(".noexiste-cluster").fadeOut();
        $(".cliente-cluster").fadeIn();
        $("#cliente-cluster-next").fadeIn();
        $("#cliente-turno").addClass('activeTurno'); 
        $("#noexiste-turno").removeClass('activeTurno');
        this.step = 1;
        this.firstStepStyles();
    }

    showNoClientTab() {
        this.step == 1;
        $(".cliente-cluster").fadeOut();
        $("#cliente-cluster-next").fadeOut();
        $(".noexiste-cluster").fadeIn();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").addClass('activeTurno');
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

    addPatientForNonClient() {
        if (this.phoneNumber.length < 8 || this.phoneNumber.length > 12) {
            this.invalidPhone = true;
            return;
        } else {
            this.invalidPhone = false;
        }
        this.loaderService.show();
        let patient = new Patient();
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;
        patient.medicalPlanId = this.medicalPlan != "-1" ? parseInt(this.medicalPlan) : null;
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
        let patient = new Patient();
        patient.clientId = this.selectedClient.id;
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;
        patient.medicalPlanId = this.medicalPlan != "-1" ? parseInt(this.medicalPlan) : null;

        this.patientService.add(patient).subscribe(ok => {
            $(".modal-agregar-paciente").fadeOut();
            this.toastrService.success('Cliente convertido en paciente correctamente.');
            this.reloadPage();
        });
    }

    medicalPlanChange(selection) {
        this.medicalPlan = selection.value;
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
        this.medicalInsurance = this.selectedPatient.medicalInsuranceId.toString();
        this.medicalPlan = this.selectedPatient.medicalPlanId.toString();
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

    addPacienteFicha(index: number) {
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
        this.selectedDate = this.pacienteFicha[index].dateTime;
        this.editingId = this.pacienteFicha[index].id;
        this.isEditing = true;
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
        let patient = new Patient();
        patient.id = this.selectedPatient.id;
        patient.clientId = this.selectedPatient.clientId;
        patient.firstName = this.firstName;
        patient.lastName = this.lastName;
        patient.address = this.address;
        patient.phoneNumber = this.phoneNumber;
        patient.dni = this.dni;
        patient.medicalPlanId = this.medicalPlan != "-1" ? parseInt(this.medicalPlan) : null;

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

    searchPatients() {
        const filter = new PatientFilter();
        filter.Text = this.searchDescription;
        this.patientService.getAllPatientsByFilter(filter).subscribe(res => {
            this.patients = res;
        });
    }
}
