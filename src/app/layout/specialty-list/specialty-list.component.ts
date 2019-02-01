import { Component, AfterViewInit } from '@angular/core';
import { Specialty } from '../../model/specialty.class';
import { SpecialtyService } from '../../service/specialty.service';
import { SubspecialtyService } from '../../service/subspecialty.service';
import { LetterFilter } from '../../model/letter-filter.class';
import { Subspecialty } from '../../model/subspecialty.class';
import { SpecialtyFilter } from '../../model/specialty-filter.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import { SelectOption } from '../../model/select/select-option.class';
import { IdFilter } from '../../model/id-filter.class';
import { DataService } from '../../service/data.service';

@Component({
    selector: 'app-specialty-list',
    templateUrl: './specialty-list.component.html',
    styleUrls: ['./specialty-list.component.css']
})

export class SpecialtyListComponent extends BaseComponent implements AfterViewInit {

    public specialties = new Array<Specialty>();

    public specialtyOptions = new Array<SelectOption>();
    public subspecialtyOptions = new Array<SelectOption>();

    public specialtyId: string;
    public subspecialtyId: string;
    public newSubspecialtyConsultationLength: string;

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
        private dataService: DataService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService,
    ) {
        super();
        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").addClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        $("a#empleado-panel").removeClass('active');
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

            if (filter.letter == '*' && this.specialties.length == 0) {
                $(".modal-informacion").fadeIn();
            }
        });
    }

    closeInformation() {
        $(".modal-informacion").fadeOut();
    }

    /* Agregar especialidad */
    showAddSpecialty() {
        this.loaderService.show()
        this.specialtyOptions = [];
        this.dataService.getSpecialtiesForSelect({id:1}).subscribe(res => {
            this.specialtyOptions = res;
            this.loaderService.hide();
            $(".modal-nueva-especialidad").fadeIn();
        });
    }

    specialtyChange(selection) {
        this.specialtyId = selection.value;
    }

    addSpecialty() {
        this.loaderService.show();
        let specialty = new IdFilter();
        specialty.id = parseInt(this.specialtyId);

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

    closeEditSpecialty() {
        $(".modal-editar-especialidad").fadeOut();
    }

    /* Agregar subespecialidad */
    showAddSubspecialty(specialtyIndex: number) {
        this.newSubspecialtyConsultationLength = '';
        this.selectedSpecialty = this.specialties[specialtyIndex];

        const specialtyId = new IdFilter();
        specialtyId.id = this.selectedSpecialty.id;
        this.loaderService.show()
        this.subspecialtyOptions = [];
        this.dataService.getSubspecialtiesByClinicForSelect(specialtyId).subscribe(res => {
            this.subspecialtyOptions = res;
            this.loaderService.hide();
            $(".modal-nueva-subespecialidad").fadeIn();
        });
    }

    subspecialtyChange(selection) {
        this.subspecialtyId = selection.value;
    }

    addSubspecialty() {
        this.loaderService.show();
        let subspecialty = new Subspecialty();
        subspecialty.id = parseInt(this.subspecialtyId);
        subspecialty.specialtyId = this.selectedSpecialty.id;
        const consultationLengthString = this.newSubspecialtyConsultationLength.split(':');
        subspecialty.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);

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
