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
import { DataService } from '../../service/data.service';
import { SelectOption } from '../../model/select/select-option.class';
import { IdFilter } from '../../model/id-filter.class';

@Component({
    selector: 'app-medical-insurance-list',
    templateUrl: './medical-insurance-list.component.html',
    styleUrls: ['./medical-insurance-list.component.css']
})

export class MedicalInsuranceComponent extends BaseComponent implements AfterViewInit {

    public medicalInsurances = new Array<MedicalInsurance>();
    public selectedMedicalInsurance: MedicalInsurance;
    public selectedMedicalPlan: MedicalPlan;

    public medicalInsuranceOptions = new Array<SelectOption>();
    public medicalPlanOptions = new Array<SelectOption>();
    public medicalInsuranceId: string;
    public medicalPlanId: string;
   
    public letterFilter: string;
    public searchDescription: string;

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../panel/assets/obrasocial.js');
    }

    constructor(
        private medicalInsuranceService: MedicalInsuranceService,
        private medicalPlanService: MedicalPlanService,
        private dataService: DataService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        this.selectedMedicalInsurance = new MedicalInsurance();
        this.selectedMedicalPlan = new MedicalPlan();
        $("a#home-panel").removeClass('active');
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

            if (filter.letter == '*' && this.medicalInsurances.length == 0) {
                $(".modal-informacion").fadeIn();
            }
        });
    }

    closeInformation() {
        $(".modal-informacion").fadeOut();
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
        this.loaderService.show()
        this.medicalInsuranceOptions = [];
        this.dataService.getMedicalInsurancesForSelect(null).subscribe(res => {
            this.medicalInsuranceOptions = res;
            this.loaderService.hide();
            $(".modal-nueva-obra-social").fadeIn();
        });
    }

    medicalInsuranceChange(selection) {
        this.medicalInsuranceId = selection.value;
    }

    closeAddMedicalInsurance() {
        $(".modal-nueva-obra-social").fadeOut();
    }

    addMedicalInsurance() {
        this.loaderService.show();
        let medicalInsurance = new IdFilter();
        medicalInsurance.id = parseInt(this.medicalInsuranceId);

        this.medicalInsuranceService.add(medicalInsurance).subscribe(ok => {
            $(".modal-nueva-obra-social").fadeOut();
            this.toastrService.success('Obra social agregada correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /*Borrar Obra Social*/
    showRemoveMedicalInsurance(medicalInsuranceIndex: number){
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        $(".borrar-obra-social").fadeIn();
    }

    closeRemoveMedicalInsurance(){
        $(".borrar-obra-social").fadeOut();
    }

    removeMedicalInsurance(){
        this.loaderService.show();
        const medicalInsuranceId = new IdFilter();
        medicalInsuranceId.id = this.selectedMedicalInsurance.id;
        this.medicalInsuranceService.remove(medicalInsuranceId).subscribe(ok => {
            $(".borrar-obra-social").fadeOut();
            this.toastrService.success('Obra social eliminada correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /* Agregar Plan */
    showAddMedicalPlan(medicalInsuranceIndex: number) {
        this.loaderService.show()
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.medicalPlanOptions = [];
        const medicalInsuranceId = new IdFilter();
        medicalInsuranceId.id = this.selectedMedicalInsurance.id;
        this.dataService.getMedicalPlansByClinicForSelect(medicalInsuranceId).subscribe(res => {
            this.medicalPlanOptions = res;
            this.loaderService.hide();
            $(".modal-nuevo-plan").fadeIn();
        });
    }

    medicalPlanChange(selection) {
        this.medicalPlanId = selection.value;
    }

    closeAddMedicalPlan() {
        $(".modal-nuevo-plan").fadeOut();
    }

    addMedicalPlan() {
        this.loaderService.show();
        let medicalPlan = new MedicalPlan();
        medicalPlan.id = parseInt(this.medicalPlanId);
        medicalPlan.medicalInsuranceId = this.selectedMedicalInsurance.id;

        this.medicalPlanService.add(medicalPlan).subscribe(ok => {
            $(".modal-nuevo-plan").fadeOut();
            this.toastrService.success('Plan medico agregado correctamente.');
            this.getMedicalInsuranceByLetter(this.letterFilter);
        });
    }

    /* Eliminar Plan */
    showRemoveMedicalPlan(medicalInsuranceIndex: number, medicalPlanIndex: number ) {
        this.selectedMedicalInsurance = this.medicalInsurances[medicalInsuranceIndex];
        this.selectedMedicalPlan = this.selectedMedicalInsurance.medicalPlans[medicalPlanIndex];
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
