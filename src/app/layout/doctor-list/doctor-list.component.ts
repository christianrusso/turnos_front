import { Component, AfterViewInit } from '@angular/core';
import { Doctor } from '../../model/doctor.class';
import { DoctorService } from '../../service/doctor.service';
import { WorkingHour } from '../../model/working-hour.class';
import { Specialty } from '../../model/specialty.class';
import { SpecialtyService } from '../../service/specialty.service';
import { DoctorFilter } from '../../model/doctor-filter.class';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { Observable } from 'rxjs/Observable';
import { SubspecialtyService } from '../../service/subspecialty.service';
import { IdFilter } from '../../model/id-filter.class';
import { Subspecialty } from '../../model/subspecialty.class';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaseComponent } from '../../core/base.component';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
    selector: 'app-doctor-list',
    templateUrl: './doctor-list.component.html',
    styleUrls: ['./doctor-list.component.css']
})

export class DoctorListComponent extends BaseComponent implements AfterViewInit {

    public doctors = new Array<Doctor>();
    public subspecialties = new Array<Subspecialty>();
    
    public selectedDoctorName = '';
    public selectedDoctor: Doctor;
    public selectedDoctorWorkingHours = new Array<WorkingHour>();

    public specialtyOptions: Array<Select2OptionData>;
    public specialtyFilter: string;

    public subspecialtyOptions: Array<Select2OptionData>;
    public subspecialtyFilter: string;

    public butttonLabel: string;

    public specialtyOptionsDoctor: Array<Select2OptionData>;
    public subspecialtyOptionsDoctor: Array<Select2OptionData>;

    public doctorId: number;
    public doctorFirstName: string;
    public doctorLastName: string;
    public doctorSpecialty: string;
    public doctorSubspecialty: string;
    public doctorConsultationLength: string;

    public doctorMondayWorks: boolean;;
    public doctorMondayWhStart: string;
    public doctorMondayWhEnd: string;

    public doctorTuesdayWorks: boolean;
    public doctorTuesdayWhStart: string;
    public doctorTuesdayWhEnd: string;

    public doctorWednesdayWorks: boolean;
    public doctorWednesdayWhStart: string;
    public doctorWednesdayWhEnd: string;

    public doctorThursdayWorks: boolean;
    public doctorThursdayWhStart: string;
    public doctorThursdayWhEnd: string;

    public doctorFridayWorks: boolean;
    public doctorFridayWhStart: string;
    public doctorFridayWhEnd: string;

    public doctorSaturdayWorks: boolean;
    public doctorSaturdayWhStart: string;
    public doctorSaturdayWhEnd: string;

    public doctorSundayWorks: boolean;
    public doctorSundayWhStart: string;
    public doctorSundayWhEnd: string;

    public addDoctorEnable = false;

    constructor(
        private doctorService: DoctorService,
        private specialtyService: SpecialtyService,
        private subspecialtyService: SubspecialtyService,
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
        this.getAllDoctorsByFilter();
        this.getAllSpecialties();
        this.getAllSubspecialties();
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/medicos.js');
    }

    getAllDoctorsByFilter() {
        this.loaderService.show();
        const filter = new DoctorFilter();
        filter.specialtyId = this.specialtyFilter != "-1" ? parseInt(this.specialtyFilter) : null;
        filter.subSpecialtyId = this.subspecialtyFilter != "-1" ? parseInt(this.subspecialtyFilter) : null;
        this.doctorService.getAllDoctorsByFilter(filter).subscribe(res => {
            this.doctors = res;
            this.loaderService.hide();

            if (isNaN(filter.specialtyId) && isNaN(filter.subSpecialtyId) && this.doctors.length == 0) {
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
            this.addDoctorEnable = res.length > 1;
            this.specialtyOptions = res;
            this.specialtyFilter = "-1";
            this.specialtyOptionsDoctor = res.map(x => Object.assign({}, x));;
            this.specialtyOptionsDoctor.shift();
            this.doctorSpecialty = "-1";
            this.loaderService.hide();
        });
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

        this.getAllDoctorsByFilter();
    }

    subspecialtyChange(selection) {
        this.subspecialtyFilter = selection.value;
        this.getAllDoctorsByFilter();
    }

    setSelectedDoctor(index: number) {
        this.selectedDoctor = this.doctors[index];
        this.selectedDoctorName = this.selectedDoctor.firstName + ' ' + this.selectedDoctor.lastName;
        $(".modal-borrar-medico").fadeIn();
    }

    cancelRemoveDoctor() {
        $(".modal-borrar-medico").fadeOut();
    }

    removeSelectedDoctor() {
        this.removeDoctor(this.selectedDoctor);
    }

    removeDoctor(doctor: Doctor) {
        this.loaderService.show();
        this.doctorService.remove(doctor).subscribe(res => {
            $(".modal-borrar-medico").fadeOut();
            this.getAllDoctorsByFilter();
        });
    }

    showAddDoctor() {
        this.doctorFirstName = "";
        this.doctorLastName = "";
        this.doctorSpecialty = null;
        this.doctorSubspecialty = null;
        this.doctorMondayWorks = false;
        this.doctorTuesdayWorks = false;
        this.doctorWednesdayWorks = false;
        this.doctorThursdayWorks = false;
        this.doctorFridayWorks = false;
        this.doctorSaturdayWorks = false;
        this.doctorSundayWorks = false;
        this.doctorConsultationLength = '';
        this.doctorMondayWhStart = '09:00';
        this.doctorMondayWhEnd = '21:00';
        this.doctorTuesdayWhStart = '09:00';
        this.doctorTuesdayWhEnd = '21:00';
        this.doctorWednesdayWhStart = '09:00';
        this.doctorWednesdayWhEnd = '21:00';
        this.doctorThursdayWhStart = '09:00';
        this.doctorThursdayWhEnd = '21:00';
        this.doctorFridayWhStart = '09:00';
        this.doctorFridayWhEnd = '21:00';
        this.doctorSaturdayWhStart = '09:00';
        this.doctorSaturdayWhEnd = '21:00';
        this.doctorSundayWhStart = '09:00';
        this.doctorSundayWhEnd = '21:00';
        sessionStorage.removeItem('doctorId');
        this.butttonLabel = "Agregar";
        $(".modal-agregar-medico").fadeIn();
    }

    hideAddDoctor() {
        $(".modal-agregar-medico").fadeOut();
    }

    showDoctorWorkingHours(index: number) {
        $(".modal-horarios").fadeIn();
        this.selectedDoctorWorkingHours = this.doctors[index].workingHours;
    }

    editDoctor(index: number) {
        let doctor = this.doctors[index];

        this.doctorFirstName = "";
        this.doctorLastName = "";
        this.doctorMondayWorks = false;
        this.doctorTuesdayWorks = false;
        this.doctorWednesdayWorks = false;
        this.doctorThursdayWorks = false;
        this.doctorFridayWorks = false;
        this.doctorSaturdayWorks = false;
        this.doctorSundayWorks = false;
        this.doctorMondayWhStart = '09:00';
        this.doctorMondayWhEnd = '21:00';
        this.doctorTuesdayWhStart = '09:00';
        this.doctorTuesdayWhEnd = '21:00';
        this.doctorWednesdayWhStart = '09:00';
        this.doctorWednesdayWhEnd = '21:00';
        this.doctorThursdayWhStart = '09:00';
        this.doctorThursdayWhEnd = '21:00';
        this.doctorFridayWhStart = '09:00';
        this.doctorFridayWhEnd = '21:00';
        this.doctorSaturdayWhStart = '09:00';
        this.doctorSaturdayWhEnd = '21:00';
        this.doctorSundayWhStart = '09:00';
        this.doctorSundayWhEnd = '21:00';

        sessionStorage.setItem('doctorId', doctor.id.toString());
        this.doctorId = doctor.id;
        this.doctorFirstName = doctor.firstName;
        this.doctorLastName = doctor.lastName;
        const hours = Math.floor(doctor.consultationLength / 60);
        const minutes = doctor.consultationLength % 60;
        this.doctorConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
        this.doctorSpecialty = doctor.specialtyId.toString();
        this.doctorSubspecialty = doctor.subspecialtyId != null ? doctor.subspecialtyId.toString() : "-1";

        doctor.workingHours.forEach(wh => {
            switch (wh.dayNumber){
                case 1:
                    this.doctorMondayWorks = true;
                    this.doctorMondayWhStart = this.getHourFromString(wh.start);
                    this.doctorMondayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 2:
                    this.doctorTuesdayWorks = true;
                    this.doctorTuesdayWhStart = this.getHourFromString(wh.start);
                    this.doctorTuesdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 3:
                    this.doctorWednesdayWorks = true;
                    this.doctorWednesdayWhStart = this.getHourFromString(wh.start);
                    this.doctorWednesdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 4:
                    this.doctorThursdayWorks = true;
                    this.doctorThursdayWhStart = this.getHourFromString(wh.start);
                    this.doctorThursdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 5:
                    this.doctorFridayWorks = true;
                    this.doctorFridayWhStart = this.getHourFromString(wh.start);
                    this.doctorFridayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 6:
                    this.doctorSaturdayWorks = true;
                    this.doctorSaturdayWhStart = this.getHourFromString(wh.start);
                    this.doctorSaturdayWhEnd = this.getHourFromString(wh.end);
                    break;
                case 0:
                    this.doctorSundayWorks = true;
                    this.doctorSundayWhStart = this.getHourFromString(wh.start);
                    this.doctorSundayWhEnd = this.getHourFromString(wh.end);
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

    specialtyChangeDoctor(selection) {
        this.loaderService.show();
        this.doctorSpecialty = selection.value;
        let filter = new IdFilter();
        filter.id = this.doctorSpecialty != null ? parseInt(this.doctorSpecialty) : -1;
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            this.subspecialtyOptionsDoctor = res;
            this.subspecialtyOptionsDoctor[0].text = 'Ninguna';
            this.loaderService.hide();
        });
    }

    subspecialtyChangeDoctor(selection) {
        this.doctorSubspecialty = selection.value;

        if (sessionStorage.getItem("doctorId") != null) {
            sessionStorage.removeItem("doctorId");
            return;
        }

        let subspecialtyId = parseInt(this.doctorSubspecialty);
        let subspecialty = this.subspecialties.find(s => s.id == subspecialtyId);
        let consultationLength = subspecialty != null ? subspecialty.consultationLength : 0;

        const hours = Math.floor(consultationLength / 60);
        const minutes = consultationLength % 60;
        this.doctorConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
    }

    addDoctor() {
        this.loaderService.show();
        let subspecialtyId = parseInt(this.doctorSubspecialty);
        let doctor = new Doctor();
        doctor.firstName = this.doctorFirstName;
        doctor.lastName = this.doctorLastName;
        doctor.specialtyId = parseInt(this.doctorSpecialty)
        doctor.subspecialtyId = subspecialtyId != -1 ? subspecialtyId : null;
        const consultationLengthString = this.doctorConsultationLength.split(':');
        doctor.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);
        doctor.workingHours = [];

        if (this.doctorMondayWorks) doctor.workingHours.push(this.getWorkingHourFromString(1, this.doctorMondayWhStart, this.doctorMondayWhEnd));
        if (this.doctorTuesdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(2, this.doctorTuesdayWhStart, this.doctorTuesdayWhEnd));
        if (this.doctorWednesdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(3, this.doctorWednesdayWhStart, this.doctorWednesdayWhEnd));
        if (this.doctorThursdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(4, this.doctorThursdayWhStart, this.doctorThursdayWhEnd));
        if (this.doctorFridayWorks) doctor.workingHours.push(this.getWorkingHourFromString(5, this.doctorFridayWhStart, this.doctorFridayWhEnd));
        if (this.doctorSaturdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(6, this.doctorSaturdayWhStart, this.doctorSaturdayWhEnd));
        if (this.doctorSundayWorks) doctor.workingHours.push(this.getWorkingHourFromString(0, this.doctorSundayWhStart, this.doctorSundayWhEnd));

        if (this.butttonLabel == "Agregar") { // Agregar doctor
            this.doctorService.add(doctor).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Doctor agregado correctamente.');
                this.getAllDoctorsByFilter();
            });
        } else { // Editar doctor
            doctor.id = this.doctorId;
            this.doctorService.edit(doctor).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Doctor modificado correctamente.');
                this.getAllDoctorsByFilter();
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
