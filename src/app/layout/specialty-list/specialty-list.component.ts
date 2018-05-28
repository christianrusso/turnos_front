import { Component, AfterViewInit } from '@angular/core';
import { Specialty } from '../../model/specialty.class';
import { SpecialtyService } from '../../service/specialty.service';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { SubspecialtyService } from '../../service/subspecialty.service';
import { LetterFilter } from '../../model/letter-filter.class';
import { Subspecialty } from '../../model/subspecialty.class';
import { SpecialtyFilter } from '../../model/specialty-filter.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-specialty-list',
    templateUrl: './specialty-list.component.html',
    styleUrls: ['./specialty-list.component.css']
})

export class SpecialtyListComponent extends BaseComponent implements AfterViewInit {

    public specialties = new Array<Specialty>();

    public newSpecialtyDescription: string;
    public newSubspecialtyDescription: string;
    public newSubspecialtyConsultationLength: NgbTimeStruct;

    public letterFilter: string;
    public searchDescription: string;

    public selectedSpecialty: Specialty;
    public selectedSubspecialty: Subspecialty;

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/especialidades.js');
    }

    constructor(
        private specialtyService: SpecialtyService,
        private subspecialtyService: SubspecialtyService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").addClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        this.selectedSpecialty = new Specialty();
        this.selectedSubspecialty = new Subspecialty();
        this.getSpecialtiesByLetter('*');
    }

    getSpecialtiesByLetter(letter: string) {
        this.loaderService.show();
        this.letterFilter = letter;
        const filter = new LetterFilter();
        filter.letter = letter;

        this.specialtyService.getSpecialtiesByLetter(filter).subscribe(res => {
            this.specialties = res;
            this.loaderService.hide();
        });
    }

    /* Agregar especialidad */
    showAddSpecialty() {
        this.newSpecialtyDescription = '';
        $(".modal-nueva-especialidad").fadeIn();
    }

    addSpecialty() {
        this.loaderService.show();
        let specialty = new Specialty();
        specialty.description = this.newSpecialtyDescription;

        this.specialtyService.add(specialty).subscribe(ok => {
            $(".modal-nueva-especialidad").fadeOut();
            this.toastrService.success('Especialidad agregada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
        });
    }

    /* Remover especialidad */
    showRemoveSpecialty(specialtyIndex: number) {
        this.selectedSpecialty = this.specialties[specialtyIndex];
        $(".modal-borrar-especialidad").fadeIn();
    }

    removeSpecialty() {
        this.loaderService.show();
        this.specialtyService.remove(this.selectedSpecialty).subscribe(ok => {
            $(".modal-borrar-especialidad").fadeOut();
            this.toastrService.success('Especialidad eliminada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
        });
    }

    closeRemoveSpecialty() {
        $(".modal-borrar-especialidad").fadeOut();
    }

    /* Editar especialidad */
    showEditSpecialty(specialtyIndex: number) {
        this.selectedSpecialty = this.specialties[specialtyIndex];
        this.newSpecialtyDescription = this.selectedSpecialty.description;
        $(".modal-editar-especialidad").fadeIn();
    }

    editSpecialty() {
        this.loaderService.show();
        let specialty = new Specialty();
        specialty.id = this.selectedSpecialty.id;
        specialty.description = this.newSpecialtyDescription;

        this.specialtyService.edit(specialty).subscribe(ok => {
            $(".modal-editar-especialidad").fadeOut();
            this.toastrService.success('Especialidad modificada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
        });
    }

    closeEditSpecialty() {
        $(".modal-editar-especialidad").fadeOut();
    }

    /* Agregar subespecialidad */
    showAddSubspecialty(specialtyIndex: number) {
        this.newSubspecialtyDescription = '';
        this.newSubspecialtyConsultationLength = { hour: 0, minute: 0, second: 0 };
        this.selectedSpecialty = this.specialties[specialtyIndex];
        $(".modal-nueva-subespecialidad").fadeIn();
    }

    addSubspecialty() {
        this.loaderService.show();
        let subspecialty = new Subspecialty();
        subspecialty.specialtyId = this.selectedSpecialty.id;
        subspecialty.description = this.newSubspecialtyDescription;
        subspecialty.consultationLength = this.newSubspecialtyConsultationLength.hour * 60 + this.newSubspecialtyConsultationLength.minute;

        this.subspecialtyService.add(subspecialty).subscribe(ok => {
            $(".modal-nueva-subespecialidad").fadeOut();
            this.toastrService.success('Subespecialidad agregada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
        });
    }

    /* Remover subespecialidad */
    showRemoveSubspecialty(specialtyIndex: number, subspecialtyIndex: number) {
        this.selectedSubspecialty = this.specialties[specialtyIndex].subspecialties[subspecialtyIndex];
        $(".modal-borrar-subespecialidad").fadeIn();
    }

    removeSubspecialty() {
        this.loaderService.show();
        this.subspecialtyService.remove(this.selectedSubspecialty).subscribe(ok => {
            $(".modal-borrar-subespecialidad").fadeOut();
            this.toastrService.success('Subespecialidad eliminada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
        });
    }

    closeRemoveSubspecialty() {
        $(".modal-borrar-subespecialidad").fadeOut();
    }

    searchSpecialties() {
        const filter = new SpecialtyFilter();
        filter.description = this.searchDescription;
        this.specialtyService.getSpecialtiesByFilter(filter).subscribe(res => {
            this.specialties = res;
        });
    }
}
