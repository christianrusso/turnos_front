import { Component, AfterViewInit } from '@angular/core';
import { Patient } from '../../model/patient.class';
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

@Component({
    selector: 'app-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrls: ['./patient-list.component.css']
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
    public dni: string;
    public medicalInsuranceOptions: Array<Select2OptionData>;
    public medicalInsurance: string;
    public medicalPlanOptions: Array<Select2OptionData>;
    public medicalPlan: string;
    public email: string;
    public password: string;

    public searchClientFilter = new ClientFilter();

    public addPatientEnable = false;

    constructor(
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
        $("a#pacientes-panel").addClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        this.getAllPatientsByFilter();
        this.getAllMedicalInsurance();
        this.getAllClientsNonPatients();
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
        $(".modal-agregar-paciente").fadeIn();
        $(".cliente-cluster").fadeIn();
        $("#cliente-turno").addClass('activeTurno');
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
    }

    showNoClientTab() {
        $(".cliente-cluster").fadeOut(); 
        $(".noexiste-cluster").fadeIn();
        $("#cliente-turno").removeClass('activeTurno');
        $("#noexiste-turno").addClass('activeTurno');
    }

    addPatientForNonClient() {
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
}
