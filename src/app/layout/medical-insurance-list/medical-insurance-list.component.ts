import { Component, AfterViewInit } from '@angular/core';
import { MedicalInsurance } from '../../model/medicalInsurance.class';
import { LetterFilter } from '../../model/letter-filter.class';
import { MedicalInsuranceService } from '../../service/medicalInsurance.service';
import { MedicalInsuranceFilter } from '../../model/medicalInsurance-filter.class';
import { MedicalPlan } from '../../model/medicalPlan.class';
import { MedicalPlanService } from '../../service/medicalPlan.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-medical-insurance-list',
    templateUrl: './medical-insurance-list.component.html',
    styleUrls: ['./medical-insurance-list.component.css']
})

export class MedicalInsuranceComponent extends BaseComponent implements AfterViewInit {

    public medicalInsurances = new Array<MedicalInsurance>();
    public selectedMedicalInsurance: MedicalInsurance;
    public selectedMedicalPlan: MedicalPlan;
   
    public letterFilter: string;
    public searchDescription: string;

    public medicalInsuranceDescription: string
    public medicalPlanDescription: string

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/obrasocial.js');
    }

    constructor(
        private medicalInsuranceService: MedicalInsuranceService,
        private medicalPlanService: MedicalPlanService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").addClass('active');
        this.selectedMedicalInsurance = new MedicalInsurance();
        this.getMedicalInsuranceByLetter('*');
    }

    getMedicalInsuranceByLetter(letter: string) {
        this.loaderService.show();
        this.letterFilter = letter;
        const filter = new LetterFilter();
        filter.letter = letter;

        this.medicalInsuranceService.getMedicalInsuranceByLetter(filter).subscribe(res => {
            this.medicalInsurances = res;
            this.loaderService.hide();
        });
    }

    searchMedicalInsurance() {
        this.loaderService.show();
        const filter = new MedicalInsuranceFilter();
        filter.description = this.searchDescription;
        this.medicalInsuranceService.getMedicalInsuranceByFilter(filter).subscribe(res => {
            this.medicalInsurances = res;
            this.loaderService.hide();
        });
    }

    /* Agregar Obra social */
    showAddMedicalInsurance() {
        this.medicalInsuranceDescription = '';
        $(".modal-nueva-obra-social").fadeIn();
    }

    closeAddMedicalInsurance() {
        $(".modal-nueva-obra-social").fadeOut();
    }

    addMedicalInsurance() {
        this.loaderService.show();
        let medicalInsurance = new MedicalInsurance();
        medicalInsurance.description = this.medicalInsuranceDescription;

        this.medicalInsuranceService.add(medicalInsurance).subscribe(ok => {
            $(".modal-nueva-obra-social").fadeOut();
            this.toastrService.success('Obra social agregada correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /* Editar Obra Social */
    showEditMedicalInsurance(medicalInsuranceIndex: number) {
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.medicalInsuranceDescription = this.selectedMedicalInsurance.description;
        $(".modal-obra-social").fadeIn();
    }

    closeEditMedicalInsurance() {
        $(".modal-obra-social").fadeOut();
    }

    editMedicalInsurance() {
        this.loaderService.show();
        let medicalInsurance = new MedicalInsurance();
        medicalInsurance.id = this.selectedMedicalInsurance.id;
        medicalInsurance.description = this.medicalInsuranceDescription;

        this.medicalInsuranceService.edit(medicalInsurance).subscribe(ok => {
            $(".modal-obra-social").fadeOut();
            this.toastrService.success('Obra social modificada correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /*Borrar Obra Social*/
    showRemoveMedicalInsurance(medicalInsuranceIndex: number){
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.medicalInsuranceDescription = this.selectedMedicalInsurance.description;
        $(".borrar-obra-social").fadeIn();
    }

    closeRemoveMedicalInsurance(){
        $(".borrar-obra-social").fadeOut();
    }

    removeMedicalInsurance(){
        this.loaderService.show();
        this.medicalInsuranceService.remove(this.selectedMedicalInsurance).subscribe(ok => {
            $(".borrar-obra-social").fadeOut();
            this.toastrService.success('Obra social eliminada correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /* Agregar Plan */
    showAddMedicalPlan(medicalInsuranceIndex: number) {
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.medicalInsuranceDescription = this.selectedMedicalInsurance.description;
        this.medicalPlanDescription = '';
        $(".modal-nuevo-plan").fadeIn();
    }

    closeAddMedicalPlan() {
        $(".modal-nuevo-plan").fadeOut();
    }

    addMedicalPlan() {
        this.loaderService.show();
        let medicalPlan = new MedicalPlan();
        medicalPlan.description = this.medicalPlanDescription;
        medicalPlan.medicalInsuranceId = this.selectedMedicalInsurance.id;

        this.medicalPlanService.add(medicalPlan).subscribe(ok => {
            $(".modal-nuevo-plan").fadeOut();
            this.toastrService.success('Plan medico agregado correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /* Eliminar Plan */
    showRemoveMedicalPlan(medicalInsuranceIndex: number,medicalPlanIndex: number ) {
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.medicalInsuranceDescription = this.selectedMedicalInsurance.description;
        this.selectedMedicalPlan = this.medicalInsurances[medicalInsuranceIndex].medicalPlans[medicalPlanIndex];
        this.medicalPlanDescription = this.selectedMedicalPlan.description;
        $(".borrar-plan").fadeIn();
    }
    
    closeRemoveMedicalPlan() {
        $(".borrar-plan").fadeOut();
    }

    removeMedicalPlan() {
        this.loaderService.show();
        this.medicalPlanService.remove(this.selectedMedicalPlan).subscribe(ok => {
            $(".borrar-plan").fadeOut();
            this.toastrService.success('Plan medico eliminado correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }
}
