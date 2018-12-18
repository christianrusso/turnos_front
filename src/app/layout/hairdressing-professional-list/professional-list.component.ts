import { Component, AfterViewInit } from '@angular/core';
import { HairdressingProfessional } from '../../model/hairdressing-professional.class';
import { HairdressingProfessionalService } from '../../service/hairdressing.professional.service';
import { WorkingHour } from '../../model/working-hour.class';
import { HairdressingSpecialtyService } from '../../service/hairdressing.specialty.service';
import { HairdressingProfessionalFilter } from '../../model/hairdressing-professional-filter.class';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { HairdressingSubspecialtyService } from '../../service/hairdressing.subspecialty.service';
import { IdFilter } from '../../model/id-filter.class';
import { Subspecialty } from '../../model/subspecialty.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
    selector: 'app-hairdressing-professional-list',
    templateUrl: './professional-list.component.html',
    styleUrls: ['./professional-list.component.css']
})

export class HairdressingProfessionalListComponent extends BaseComponent implements AfterViewInit {

    public professionals = new Array<HairdressingProfessional>();
    public subspecialties = new Array<Subspecialty>();
    
    public selectedProfessionalName = '';
    public selectedProfessional: HairdressingProfessional;
    public selectedProfessionalWorkingHours = new Array<WorkingHour>();

    public specialtyOptions: Array<Select2OptionData>;
    public specialtyFilter: string;

    public subspecialtyOptions: Array<Select2OptionData>;
    public subspecialtyFilter: string;

    public butttonLabel: string;

    public specialtyOptionsProfessional: Array<Select2OptionData>;
    public subspecialtyOptionsProfessional: Array<Select2OptionData>;

    public professionalId: number;
    public professionalFirstName: string;
    public professionalLastName: string;
    public professionalSpecialty: string;
    public professionalSubspecialty: string;
    public professionalConsultationLength: string;

    public professionalMondayWorks: boolean;;
    public professionalMondayWhStart: string;
    public professionalMondayWhEnd: string;

    public professionalTuesdayWorks: boolean;
    public professionalTuesdayWhStart: string;
    public professionalTuesdayWhEnd: string;

    public professionalWednesdayWorks: boolean;
    public professionalWednesdayWhStart: string;
    public professionalWednesdayWhEnd: string;

    public professionalThursdayWorks: boolean;
    public professionalThursdayWhStart: string;
    public professionalThursdayWhEnd: string;

    public professionalFridayWorks: boolean;
    public professionalFridayWhStart: string;
    public professionalFridayWhEnd: string;

    public professionalSaturdayWorks: boolean;
    public professionalSaturdayWhStart: string;
    public professionalSaturdayWhEnd: string;

    public professionalSundayWorks: boolean;
    public professionalSundayWhStart: string;
    public professionalSundayWhEnd: string;

    public addProfessionalEnable = false;

    constructor(
        private hairdressingProfessionalService: HairdressingProfessionalService,
        private specialtyService: HairdressingSpecialtyService,
        private subspecialtyService: HairdressingSubspecialtyService,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").addClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        this.getAllProfessionalsByFilter();
        this.getAllSpecialties();
        this.getAllSubspecialties();
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../panel/assets/medicos.js');
    }

    getAllProfessionalsByFilter() {
        this.loaderService.show();
        const filter = new HairdressingProfessionalFilter();
        filter.specialtyId = this.specialtyFilter != "-1" ? parseInt(this.specialtyFilter) : null;
        filter.subSpecialtyId = this.subspecialtyFilter != "-1" ? parseInt(this.subspecialtyFilter) : null;
        this.hairdressingProfessionalService.getAllProfessionalsByFilter(filter).subscribe(res => {
            this.professionals = res;
            this.loaderService.hide();

            if (isNaN(filter.specialtyId) && isNaN(filter.subSpecialtyId) && this.professionals.length == 0) {
                $(".modal-informacion").fadeIn();
            }
        });
    }

    closeInformation() {
        $(".modal-informacion").fadeOut();
    }
    
    getAllSpecialties() {
        this.loaderService.show();
        this.specialtyService.getAllSpecialtiesForSelect().subscribe(res => {
            this.addProfessionalEnable = res.length > 1;
            this.specialtyOptions = res;
            this.specialtyFilter = "-1";
            this.specialtyOptionsProfessional = res.map(x => Object.assign({}, x));;
            this.specialtyOptionsProfessional.shift();
            this.professionalSpecialty = "-1";
            this.loaderService.hide();
        });;
    }

    getAllSubspecialties() {
        this.loaderService.show();
        this.subspecialtyService.getAllSubspecialties().subscribe(res => this.subspecialties = res);
        let filter = new IdFilter();
        filter.id = -1;
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptions = res;
            this.loaderService.hide();
        });
    }

    specialtyChange(selection) {
        this.loaderService.show();
        this.specialtyFilter = selection.value;
        this.subspecialtyFilter = "-1";
        let filter = new IdFilter();
        filter.id = parseInt(this.specialtyFilter);
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptions = res;
            this.loaderService.hide();
        });

        this.getAllProfessionalsByFilter();
    }

    subspecialtyChange(selection) {
        this.subspecialtyFilter = selection.value;
        this.getAllProfessionalsByFilter();
    }

    setSelectedProfessional(index: number) {
        this.selectedProfessional = this.professionals[index];
        this.selectedProfessionalName = this.selectedProfessional.firstName + ' ' + this.selectedProfessional.lastName;
        $(".modal-borrar-medico").fadeIn();
    }

    cancelRemoveProfessional() {
        $(".modal-borrar-medico").fadeOut();
    }

    removeSelectedProfessional() {
        this.removeProfessional(this.selectedProfessional);
    }

    removeProfessional(professional: HairdressingProfessional) {
        this.loaderService.show();
        this.hairdressingProfessionalService.remove(professional).subscribe(res => {
            $(".modal-borrar-medico").fadeOut();
            this.getAllProfessionalsByFilter();
        });
    }

    showAddProfessional() {
        this.professionalFirstName = "";
        this.professionalLastName = "";
        this.professionalSpecialty = null;
        this.professionalSubspecialty = null;
        this.professionalMondayWorks = false;
        this.professionalTuesdayWorks = false;
        this.professionalWednesdayWorks = false;
        this.professionalThursdayWorks = false;
        this.professionalFridayWorks = false;
        this.professionalSaturdayWorks = false;
        this.professionalSundayWorks = false;
        this.professionalConsultationLength = '';
        this.professionalMondayWhStart = '09:00';
        this.professionalMondayWhEnd = '21:00';
        this.professionalTuesdayWhStart = '09:00';
        this.professionalTuesdayWhEnd = '21:00';
        this.professionalWednesdayWhStart = '09:00';
        this.professionalWednesdayWhEnd = '21:00';
        this.professionalThursdayWhStart = '09:00';
        this.professionalThursdayWhEnd = '21:00';
        this.professionalFridayWhStart = '09:00';
        this.professionalFridayWhEnd = '21:00';
        this.professionalSaturdayWhStart = '09:00';
        this.professionalSaturdayWhEnd = '21:00';
        this.professionalSundayWhStart = '09:00';
        this.professionalSundayWhEnd = '21:00';
        sessionStorage.removeItem('hairdressingProfessionalId');
        this.butttonLabel = "Agregar";
        $(".modal-agregar-medico").fadeIn();
    }

    hideAddProfessional() {
        $(".modal-agregar-medico").fadeOut();
    }

    showProfessionalWorkingHours(index: number) {
        $(".modal-horarios").fadeIn();
        this.selectedProfessionalWorkingHours = this.professionals[index].workingHours;
    }

    editProfessional(index: number) {
        let professional = this.professionals[index];

        this.professionalFirstName = "";
        this.professionalLastName = "";
        this.professionalMondayWorks = false;
        this.professionalTuesdayWorks = false;
        this.professionalWednesdayWorks = false;
        this.professionalThursdayWorks = false;
        this.professionalFridayWorks = false;
        this.professionalSaturdayWorks = false;
        this.professionalSundayWorks = false;
        this.professionalMondayWhStart = '09:00';
        this.professionalMondayWhEnd = '21:00';
        this.professionalTuesdayWhStart = '09:00';
        this.professionalTuesdayWhEnd = '21:00';
        this.professionalWednesdayWhStart = '09:00';
        this.professionalWednesdayWhEnd = '21:00';
        this.professionalThursdayWhStart = '09:00';
        this.professionalThursdayWhEnd = '21:00';
        this.professionalFridayWhStart = '09:00';
        this.professionalFridayWhEnd = '21:00';
        this.professionalSaturdayWhStart = '09:00';
        this.professionalSaturdayWhEnd = '21:00';
        this.professionalSundayWhStart = '09:00';
        this.professionalSundayWhEnd = '21:00';

        sessionStorage.setItem('hairdressingProfessionalId', professional.id.toString());
        this.professionalId = professional.id;
        this.professionalFirstName = professional.firstName;
        this.professionalLastName = professional.lastName;
        const hours = Math.floor(professional.consultationLength / 60);
        const minutes = professional.consultationLength % 60;
        this.professionalConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
        this.professionalSpecialty = professional.specialtyId.toString();
        this.professionalSubspecialty = professional.subspecialtyId != null ? professional.subspecialtyId.toString() : "-1";

        professional.workingHours.forEach(wh => {
            switch (wh.dayNumber){
                case 1:
                    this.professionalMondayWorks = true;
                    this.professionalMondayWhStart = this.getHourFromString(wh.start);
                    this.professionalMondayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 2:
                    this.professionalTuesdayWorks = true;
                    this.professionalTuesdayWhStart = this.getHourFromString(wh.start);
                    this.professionalTuesdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 3:
                    this.professionalWednesdayWorks = true;
                    this.professionalWednesdayWhStart = this.getHourFromString(wh.start);
                    this.professionalWednesdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 4:
                    this.professionalThursdayWorks = true;
                    this.professionalThursdayWhStart = this.getHourFromString(wh.start);
                    this.professionalThursdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 5:
                    this.professionalFridayWorks = true;
                    this.professionalFridayWhStart = this.getHourFromString(wh.start);
                    this.professionalFridayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 6:
                    this.professionalSaturdayWorks = true;
                    this.professionalSaturdayWhStart = this.getHourFromString(wh.start);
                    this.professionalSaturdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 0:
                    this.professionalSundayWorks = true;
                    this.professionalSundayWhStart = this.getHourFromString(wh.start);
                    this.professionalSundayWhEnd = this.getHourFromString(wh.end);
                    break;
            }
        });
        this.butttonLabel = "Guardar";
        $(".modal-agregar-medico").fadeIn();
    }

    getHourFromString(strDate: string): string {
        let timeData = strDate.split(":");
        return timeData[0] + ':' + timeData[1];
    }

    getWorkingHourDescription(workingHour: WorkingHour): string {
        return workingHour.start.slice(0, -3) + ' a ' + workingHour.end.slice(0, -3) + ' hs';
    }

    getDayName(workingHour: WorkingHour): string {
        switch (workingHour.dayNumber) {
            case 0:
                return "Domingo";
            case 1:
                return "Lunes";
            case 2:
                return "Martes";
            case 3:
                return "Miercoles";
            case 4:
                return "Jueves";
            case 5:
                return "Viernes";
            case 6:
                return "Sabado";
            default:
                return "Dia desconocido";
        }
    }

    specialtyChangeProfessional(selection) {
        this.loaderService.show();
        this.professionalSpecialty = selection.value;
        let filter = new IdFilter();
        filter.id = this.professionalSpecialty != null ? parseInt(this.professionalSpecialty) : -1;
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptionsProfessional = res;
            this.subspecialtyOptionsProfessional[0].text = 'Ninguna';
            this.loaderService.hide();
        });
    }

    subspecialtyChangeProfessional(selection) {
        this.professionalSubspecialty = selection.value;

        if (sessionStorage.getItem("hairdressingProfessionalId") != null) {
            sessionStorage.removeItem("hairdressingProfessionalId");
            return;
        }

        let subspecialtyId = parseInt(this.professionalSubspecialty);
        let subspecialty = this.subspecialties.find(s => s.id == subspecialtyId);
        let consultationLength = subspecialty != null ? subspecialty.consultationLength : 0;

        const hours = Math.floor(consultationLength / 60);
        const minutes = consultationLength % 60;
        this.professionalConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
    }

    addProfessional() {
        this.loaderService.show();
        let subspecialtyId = parseInt(this.professionalSubspecialty);
        let professional = new HairdressingProfessional();
        professional.firstName = this.professionalFirstName;
        professional.lastName = this.professionalLastName;
        professional.specialtyId = parseInt(this.professionalSpecialty)
        professional.subspecialtyId = subspecialtyId != -1 ? subspecialtyId : null;
        const consultationLengthString = this.professionalConsultationLength.split(':');
        professional.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);
        professional.workingHours = [];

        if (this.professionalMondayWorks) professional.workingHours.push(this.getWorkingHourFromString(1, this.professionalMondayWhStart, this.professionalMondayWhEnd));
        if (this.professionalTuesdayWorks) professional.workingHours.push(this.getWorkingHourFromString(2, this.professionalTuesdayWhStart, this.professionalTuesdayWhEnd));
        if (this.professionalWednesdayWorks) professional.workingHours.push(this.getWorkingHourFromString(3, this.professionalWednesdayWhStart, this.professionalWednesdayWhEnd));
        if (this.professionalThursdayWorks) professional.workingHours.push(this.getWorkingHourFromString(4, this.professionalThursdayWhStart, this.professionalThursdayWhEnd));
        if (this.professionalFridayWorks) professional.workingHours.push(this.getWorkingHourFromString(5, this.professionalFridayWhStart, this.professionalFridayWhEnd));
        if (this.professionalSaturdayWorks) professional.workingHours.push(this.getWorkingHourFromString(6, this.professionalSaturdayWhStart, this.professionalSaturdayWhEnd));
        if (this.professionalSundayWorks) professional.workingHours.push(this.getWorkingHourFromString(0, this.professionalSundayWhStart, this.professionalSundayWhEnd));

        if (this.butttonLabel == "Agregar") { // Agregar professional
            this.hairdressingProfessionalService.add(professional).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Professional agregado correctamente.');
                this.getAllProfessionalsByFilter();
            });
        } else { // Editar professional
            professional.id = this.professionalId;
            this.hairdressingProfessionalService.edit(professional).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Professional modificado correctamente.');
                this.getAllProfessionalsByFilter();
            });
        }
    }

     getWorkingHourFromString(dayNumber: number, start: string, end: string): WorkingHour {
        let wh = new WorkingHour();
        wh.dayNumber = dayNumber;

        if (start.indexOf('-') != -1 || end.indexOf('-') != -1) {
            this.toastrService.error('Los horarios ingresados para el día ' + this.getDayName(wh) + ' son invalidos.');
        }
        wh.start = start;
        wh.end = end;
        return wh;
     }

     convertHoursAndMinutesToString(hours: number, minutes: number): string {
         const hoursString = hours < 10 ? '0' + hours : hours;
         const minutesString = minutes < 10 ? '0' + minutes : minutes;
         return hoursString + ':' + minutesString; 
     }
}
