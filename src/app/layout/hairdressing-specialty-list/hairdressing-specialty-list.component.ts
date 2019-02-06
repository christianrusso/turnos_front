import { Component, AfterViewInit } from '@angular/core';
import { Specialty } from '../../model/specialty.class';
import { HairdressingSpecialtyService } from '../../service/hairdressing.specialty.service';
import { HairdressingSubspecialtyService } from '../../service/hairdressing.subspecialty.service';
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
    selector: 'app-hairdressing-specialty-list',
    templateUrl: './hairdressing-specialty-list.component.html',
    styleUrls: ['./hairdressing-specialty-list.component.css']
})

export class HairdressingSpecialtyListComponent extends BaseComponent implements AfterViewInit {

    public specialties = new Array<Specialty>();

    public specialtyOptions = new Array<SelectOption>();
    public subspecialtyOptions = new Array<SelectOption>();

    public specialtyId: string;
    public subspecialtyId: string;
    public newSubspecialtyConsultationLength: string;
    public newSubspecialtyPrice: number;
    public newSubspecialtyIndication: string;
    public editSubspecialtyName: string;

    public letterFilter: string;
    public searchDescription: string;

    public selectedSpecialty: Specialty;
    public selectedSubspecialty: Subspecialty;

    public invalidHour = false;

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/especialidades.js');
    }

    constructor(
        private specialtyService: HairdressingSpecialtyService,
        private subspecialtyService: HairdressingSubspecialtyService,
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
        this.dataService.getSpecialtiesForSelect({id:sessionStorage.getItem("rubro")}).subscribe(res => {
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
        this.newSubspecialtyPrice = null;
        this.selectedSpecialty = this.specialties[specialtyIndex];

        const specialtyId = new IdFilter();
        specialtyId.id = this.selectedSpecialty.id;
        this.loaderService.show()
        this.subspecialtyOptions = [];
        this.dataService.getSubspecialtiesByHairdressingForSelect(specialtyId).subscribe(res => {
            this.subspecialtyOptions = res;
            this.loaderService.hide();
            $(".modal-nueva-subespecialidad").fadeIn();
        });
    }

    subspecialtyChange(selection) {
        this.subspecialtyId = selection.value;
    }

    addSubspecialty() {
        let subspecialty = new Subspecialty();
        subspecialty.id = parseInt(this.subspecialtyId);
        subspecialty.specialtyId = this.selectedSpecialty.id;
        if (this.newSubspecialtyConsultationLength.length < 5) {
            this.invalidHour = true;
        } else {
            this.invalidHour = false;
            this.loaderService.show();
            const consultationLengthString = this.newSubspecialtyConsultationLength.split(':');
            subspecialty.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);
            subspecialty.price = this.newSubspecialtyPrice;
            subspecialty.indications = this.newSubspecialtyIndication;

            this.subspecialtyService.add(subspecialty).subscribe(ok => {
                $(".modal-nueva-subespecialidad").fadeOut();
                this.toastrService.success('Subespecialidad agregada correctamente.');
                this.getSpecialtiesByLetter(this.letterFilter);
                this.newSubspecialtyIndication = "";
                this.newSubspecialtyConsultationLength = "";
                this.newSubspecialtyPrice = 0;
            });
        }
    }

    /* Remover subespecialidad */
    showRemoveSubspecialty(specialtyIndex: number, subspecialtyIndex: number) {
        this.selectedSubspecialty = this.specialties[specialtyIndex].subspecialties[subspecialtyIndex];
        $(".modal-borrar-subespecialidad").fadeIn();
    }

    editSubspecialty(specialtyIndex: number, subspecialtyIndex: number) {
        this.selectedSubspecialty = this.specialties[specialtyIndex].subspecialties[subspecialtyIndex];
        this.newSubspecialtyIndication = this.selectedSubspecialty.indications;
        this.editSubspecialtyName = this.selectedSubspecialty.description;
        this.subspecialtyId = this.selectedSubspecialty.id.toString();
        this.newSubspecialtyPrice = this.selectedSubspecialty.price;

        const hours = Math.floor(this.selectedSubspecialty.consultationLength / 60);
        const minutes = this.selectedSubspecialty.consultationLength % 60;
        const doctorConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);

        this.newSubspecialtyConsultationLength = doctorConsultationLength;

        $(".modal-editar-subespecialidad").fadeIn();
    }

    sendEditSubscpecialty() {
        this.loaderService.show();
        let subspecialty = new Subspecialty();
        subspecialty.id = parseInt(this.subspecialtyId);
        const consultationLengthString = this.newSubspecialtyConsultationLength.split(':');
        subspecialty.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);
        subspecialty.indications = this.newSubspecialtyIndication;
        subspecialty.price = this.newSubspecialtyPrice;

        this.subspecialtyService.edit(subspecialty).subscribe(ok => {
            $(".modal-editar-subespecialidad").fadeOut();
            this.toastrService.success('Subespecialidad editada correctamente.');
            this.getSpecialtiesByLetter(this.letterFilter);
            this.newSubspecialtyIndication = "";
            this.newSubspecialtyConsultationLength = "";
            this.newSubspecialtyPrice = 0;
        });
    }

    convertHoursAndMinutesToString(hours: number, minutes: number): string {
        const hoursString = hours < 10 ? '0' + hours : hours;
        const minutesString = minutes < 10 ? '0' + minutes : minutes;
        return hoursString + ':' + minutesString;
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
