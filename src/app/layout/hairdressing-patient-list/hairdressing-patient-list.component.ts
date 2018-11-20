import { Component, AfterViewInit } from '@angular/core';
import { HairdressingPatient } from '../../model/hairdressing-patient.class';
import { HairdressingPatientService } from '../../service/hairdressing-patient.service';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { HairdressingPatientFilter } from '../../model/hairdressing-patient-filter.class';
import { MedicalInsuranceService } from '../../service/medicalInsurance.service';
import { Client } from '../../model/client.class';
import { ClientService } from '../../service/client.service';
import { RequestAppointmentClient } from '../../model/request-appointment-client.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { IdFilter } from '../../model/id-filter.class';
import { MedicalPlanService } from '../../service/medicalPlan.service';

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
    public dni: string;
    public email: string;
    public password: string;

    constructor(
        private patientService: HairdressingPatientService,
        private clientService: ClientService,
        private router: Router,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").addClass('active');
        $("a#calendario-panel").removeClass('active');
        this.getAllPatientsByFilter();
        this.getAllClientsNonPatients();
    }

    private reloadPage(){
        this.getAllPatientsByFilter();
        this.getAllClientsNonPatients();
    }

    getAllClientsNonPatients() {
        this.clientService.getAllClientsNonHairdressingPatients().subscribe(res => {
            this.clients = res;
        });
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../panel/assets/pacientes.js');
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
        });
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

    // ADD Patient
    cleanPatient() {
        this.firstName = "";
        this.lastName = "";
        this.address = "";
        this.phoneNumber = "";
        this.dni = "";
        this.email = "";
        this.password = "";
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
}
