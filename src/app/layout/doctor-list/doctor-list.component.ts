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
import { DateTimeAdapter } from 'ng-pick-datetime';
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

    public specialtyOptionsDoctor: Array<Select2OptionData>;
    public subspecialtyOptionsDoctor: Array<Select2OptionData>;

    public doctorFirstName: string;
    public doctorLastName: string;
    public doctorSpecialty: string;
    public doctorSubspecialty: string;
    public doctorConsultationLength: Date;

    public doctorMondayWorks: boolean;;
    public doctorMondayWhStart: Date;
    public doctorMondayWhEnd: Date;

    public doctorTuesdayWorks: boolean;
    public doctorTuesdayWhStart: Date;
    public doctorTuesdayWhEnd: Date;

    public doctorWednesdayWorks: boolean;
    public doctorWednesdayWhStart: Date;
    public doctorWednesdayWhEnd: Date;

    public doctorThursdayWorks: boolean;
    public doctorThursdayWhStart: Date;
    public doctorThursdayWhEnd: Date;

    public doctorFridayWorks: boolean;
    public doctorFridayWhStart: Date;
    public doctorFridayWhEnd: Date;

    public doctorSaturdayWorks: boolean;
    public doctorSaturdayWhStart: Date;
    public doctorSaturdayWhEnd: Date;

    public doctorSundayWorks: boolean;
    public doctorSundayWhStart: Date;
    public doctorSundayWhEnd: Date;

    public zeroHour = new Date(2018, 1, 1, 0, 0, 0);

    constructor(
        private doctorService: DoctorService,
        private specialtyService: SpecialtyService,
        private subspecialtyService: SubspecialtyService,
        private dateTimeAdapter: DateTimeAdapter<any>,
        private loaderService: Ng4LoadingSpinnerService,
        private toastrService: ToastrService
    ) {
        super();
        $("a#medicos-panel").addClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
        dateTimeAdapter.setLocale('es-Es');
        this.doctorConsultationLength = new Date(this.zeroHour);
        this.doctorMondayWhStart = new Date(this.zeroHour);
        this.doctorMondayWhEnd = new Date(this.zeroHour);
        this.doctorTuesdayWhStart = new Date(this.zeroHour);
        this.doctorTuesdayWhEnd = new Date(this.zeroHour);
        this.doctorWednesdayWhStart = new Date(this.zeroHour);
        this.doctorWednesdayWhEnd = new Date(this.zeroHour);
        this.doctorThursdayWhStart = new Date(this.zeroHour);
        this.doctorThursdayWhEnd = new Date(this.zeroHour);
        this.doctorFridayWhStart = new Date(this.zeroHour);
        this.doctorFridayWhEnd = new Date(this.zeroHour);
        this.doctorSaturdayWhStart = new Date(this.zeroHour);
        this.doctorSaturdayWhEnd = new Date(this.zeroHour);
        this.doctorSundayWhStart = new Date(this.zeroHour);
        this.doctorSundayWhEnd = new Date(this.zeroHour);
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
        });
    }
    
    getAllSpecialties() {
        this.loaderService.show();
        this.specialtyService.getAllSpecialtiesForSelect().subscribe(res => {
            this.specialtyOptions = res;
            this.specialtyFilter = "-1";
            this.specialtyOptionsDoctor = res.map(x => Object.assign({}, x));;
            this.specialtyOptionsDoctor.shift();
            this.doctorSpecialty = "-1";
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
        this.doctorConsultationLength = new Date(this.zeroHour);
        this.doctorMondayWorks = false;
        this.doctorTuesdayWorks = false;
        this.doctorWednesdayWorks = false;
        this.doctorThursdayWorks = false;
        this.doctorFridayWorks = false;
        this.doctorSaturdayWorks = false;
        this.doctorSundayWorks = false;
        this.doctorMondayWhStart = new Date(this.zeroHour);
        this.doctorMondayWhEnd = new Date(this.zeroHour);
        this.doctorTuesdayWhStart = new Date(this.zeroHour);
        this.doctorTuesdayWhEnd = new Date(this.zeroHour);
        this.doctorWednesdayWhStart = new Date(this.zeroHour);
        this.doctorWednesdayWhEnd = new Date(this.zeroHour);
        this.doctorThursdayWhStart = new Date(this.zeroHour);
        this.doctorThursdayWhEnd = new Date(this.zeroHour);
        this.doctorFridayWhStart = new Date(this.zeroHour);
        this.doctorFridayWhEnd = new Date(this.zeroHour);
        this.doctorSaturdayWhStart = new Date(this.zeroHour);
        this.doctorSaturdayWhEnd = new Date(this.zeroHour);
        this.doctorSundayWhStart = new Date(this.zeroHour);
        this.doctorSundayWhEnd = new Date(this.zeroHour);
        sessionStorage.removeItem('doctorId');
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

        sessionStorage.setItem('doctorId', doctor.id.toString());
        this.doctorFirstName = doctor.firstName;
        this.doctorLastName = doctor.lastName;
        this.doctorSpecialty = doctor.specialtyId.toString();
        this.doctorSubspecialty = doctor.subspecialtyId != null ? doctor.subspecialtyId.toString() : "-1";
        this.doctorConsultationLength = new Date(this.zeroHour);
        this.doctorConsultationLength.setMinutes(doctor.consultationLength);

        doctor.workingHours.forEach(wh => {
            switch (wh.dayNumber){
                case 1:
                    this.doctorMondayWorks = true;
                    this.doctorMondayWhStart = this.getDateFromString(wh.start);
                    this.doctorMondayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 2:
                    this.doctorTuesdayWorks = true;
                    this.doctorTuesdayWhStart = this.getDateFromString(wh.start);
                    this.doctorTuesdayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 3:
                    this.doctorWednesdayWorks = true;
                    this.doctorWednesdayWhStart = this.getDateFromString(wh.start);
                    this.doctorWednesdayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 4:
                    this.doctorThursdayWorks = true;
                    this.doctorThursdayWhStart = this.getDateFromString(wh.start);
                    this.doctorThursdayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 5:
                    this.doctorFridayWorks = true;
                    this.doctorFridayWhStart = this.getDateFromString(wh.start);
                    this.doctorFridayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 6:
                    this.doctorSaturdayWorks = true;
                    this.doctorSaturdayWhStart = this.getDateFromString(wh.start);
                    this.doctorSaturdayWhEnd = this.getDateFromString(wh.end);
                    break;
                case 0:
                    this.doctorSundayWorks = true;
                    this.doctorSundayWhStart = this.getDateFromString(wh.start);
                    this.doctorSundayWhEnd = this.getDateFromString(wh.end);
                    break;
            }
        });

        $(".modal-agregar-medico").fadeIn();
    }

    getDateFromString(strDate: string): Date {
        let dateData = strDate.split(":");
        let res = new Date(this.zeroHour);
        res.setHours(parseInt(dateData[0]));
        res.setMinutes(parseInt(dateData[1]));
        return res;
    }

    getWorkingHourDescription(workingHour: WorkingHour): string {
        return workingHour.start + ' a ' + workingHour.end + ' hs';
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
        let subspecialtyId = parseInt(this.doctorSubspecialty);
        let subspecialty = this.subspecialties.find(s => s.id == subspecialtyId);
        let consultationLength = subspecialty != null ? subspecialty.consultationLength : 0;
       
        this.doctorConsultationLength = new Date(this.zeroHour);
        this.doctorConsultationLength.setMinutes(consultationLength);
    }

    addDoctor() {
        this.loaderService.show();
        let subspecialtyId = parseInt(this.doctorSubspecialty);
        let doctor = new Doctor();
        doctor.firstName = this.doctorFirstName;
        doctor.lastName = this.doctorLastName;
        doctor.specialtyId = parseInt(this.doctorSpecialty)
        doctor.subspecialtyId = subspecialtyId != -1 ? subspecialtyId : null;
        doctor.consultationLength = this.doctorConsultationLength.getHours() * 60 + this.doctorConsultationLength.getMinutes();
        doctor.workingHours = [];
        if (this.doctorMondayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(1, this.doctorMondayWhStart, this.doctorMondayWhEnd));
        if (this.doctorTuesdayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(2, this.doctorTuesdayWhStart, this.doctorTuesdayWhEnd));
        if (this.doctorWednesdayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(3, this.doctorWednesdayWhStart, this.doctorWednesdayWhEnd));
        if (this.doctorThursdayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(4, this.doctorThursdayWhStart, this.doctorThursdayWhEnd));
        if (this.doctorFridayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(5, this.doctorFridayWhStart, this.doctorFridayWhEnd));
        if (this.doctorSaturdayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(6, this.doctorSaturdayWhStart, this.doctorSaturdayWhEnd));
        if (this.doctorSundayWorks) doctor.workingHours.push(this.getWorkingHourFromDate(0, this.doctorSundayWhStart, this.doctorSundayWhEnd));

        let doctorId = sessionStorage.getItem('doctorId');

        if (doctorId == null) { // Agregar doctor
            this.doctorService.add(doctor).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Doctor agregado correctamente.');
                this.getAllDoctorsByFilter();
            });
        } else { // Editar doctor
            doctor.id = parseInt(doctorId);
            this.doctorService.edit(doctor).subscribe(ok => {
                $(".modal-agregar-medico").fadeOut();
                this.toastrService.success('Doctor modificado correctamente.');
                this.getAllDoctorsByFilter();
            });
        }
    }

    getWorkingHourFromDate(dayNumber: number, start: Date, end: Date): WorkingHour {
        let wh = new WorkingHour();
        wh.dayNumber = dayNumber;
        wh.start = start.getHours() + ':' + start.getMinutes();
        wh.end = end.getHours() + ':' + end.getMinutes();
        return wh;
     }
}
