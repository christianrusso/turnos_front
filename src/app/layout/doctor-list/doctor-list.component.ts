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
    public selectedDoctorSubspecialities = new Array();

    public specialtyOptions: Array<Select2OptionData>;
    public specialtyFilter: string;

    public subspecialtyOptions: Array<Select2OptionData>;
    public subspecialtyFilter: string;

    public butttonLabel: string;

    public specialtyOptionsDoctor: Array<Select2OptionData>;
    public subspecialtyOptionsDoctor = [];

    public doctorId: number;
    public doctorFirstName: string;
    public doctorLastName: string;
    public doctorSpecialty: string;
    public doctorSubspecialty: string;
    public doctorConsultationLength: string;

    public doctorMondayWorks: boolean;
    public doctorMondayWhStart: string;
    public doctorMondayWhEnd: string;
    public doctorMondaySplit: boolean;
    public doctorMondaySecondWhStart: string;
    public doctorMondaySecondWhEnd: string;

    public doctorTuesdayWorks: boolean;
    public doctorTuesdayWhStart: string;
    public doctorTuesdayWhEnd: string;
    public doctorTuesdaySplit: boolean;
    public doctorTuesdaySecondWhStart: string;
    public doctorTuesdaySecondWhEnd: string;

    public doctorWednesdayWorks: boolean;
    public doctorWednesdayWhStart: string;
    public doctorWednesdayWhEnd: string;
    public doctorWednesdaySplit: boolean;
    public doctorWednesdaySecondWhStart: string;
    public doctorWednesdaySecondWhEnd: string;

    public doctorThursdayWorks: boolean;
    public doctorThursdayWhStart: string;
    public doctorThursdayWhEnd: string;
    public doctorThursdaySplit: boolean;
    public doctorThursdaySecondWhStart: string;
    public doctorThursdaySecondWhEnd: string;

    public doctorFridayWorks: boolean;
    public doctorFridayWhStart: string;
    public doctorFridayWhEnd: string;
    public doctorFridaySplit: boolean;
    public doctorFridaySecondWhStart: string;
    public doctorFridaySecondWhEnd: string;

    public doctorSaturdayWorks: boolean;
    public doctorSaturdayWhStart: string;
    public doctorSaturdayWhEnd: string;
    public doctorSaturdaySplit: boolean;
    public doctorSaturdaySecondWhStart: string;
    public doctorSaturdaySecondWhEnd: string;

    public doctorSundayWorks: boolean;
    public doctorSundayWhStart: string;
    public doctorSundayWhEnd: string;
    public doctorSundaySplit: boolean;
    public doctorSundaySecondWhStart: string;
    public doctorSundaySecondWhEnd: string;

    public addProfessionalEnable = false;
    public doctorSpecialities = [
        {
            doctorSpecialty: "",
            doctorSubspecialty: "",
            doctorConsultationLength: ""
        }
    ];

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
        $("a#empleado-panel").removeClass('active');
        this.getAllDoctorsByFilter();
        this.getAllSpecialties();
        this.getAllSubspecialties();
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('/assets/medicos.js');
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
            this.specialtyOptionsDoctor = res.map(x => Object.assign({}, x));
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

        this.doctorMondaySecondWhStart = '';
        this.doctorMondaySecondWhEnd = '';
        this.doctorTuesdaySecondWhStart = '';
        this.doctorTuesdaySecondWhEnd = '';
        this.doctorWednesdaySecondWhStart = '';
        this.doctorWednesdaySecondWhEnd = '';
        this.doctorThursdaySecondWhStart = '';
        this.doctorThursdaySecondWhEnd = '';
        this.doctorFridaySecondWhStart = '';
        this.doctorFridaySecondWhEnd = '';
        this.doctorSaturdaySecondWhStart = '';
        this.doctorSaturdaySecondWhEnd = '';
        this.doctorSundaySecondWhStart = '';
        this.doctorSundaySecondWhEnd = '';

        this.doctorMondaySplit = false;
        this.doctorTuesdaySplit = false;
        this.doctorWednesdaySplit = false;
        this.doctorThursdaySplit = false;
        this.doctorFridaySplit = false;
        this.doctorSaturdaySplit = false;
        this.doctorSundaySplit = false;

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

    showDoctorEspecialidades(index: number) {
        $(".modal-especialidades").fadeIn();
        this.selectedDoctorSubspecialities = [];
        for (let i = 0; i < this.doctors[index].subspecialties.length; i++) {
            if (!this.selectedDoctorSubspecialities[this.doctors[index].subspecialties[i].specialtyId]) {
                this.selectedDoctorSubspecialities[this.doctors[index].subspecialties[i].specialtyId] = new Array();
            }
        }
        for (let i = 0; i < this.doctors[index].subspecialties.length; i++) {
            this.selectedDoctorSubspecialities[this.doctors[index].subspecialties[i].specialtyId].push(this.doctors[index].subspecialties[i]);
        }
        this.selectedDoctorSubspecialities.splice(0, 1);
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

        this.doctorMondaySecondWhStart = '';
        this.doctorMondaySecondWhEnd = '';
        this.doctorTuesdaySecondWhStart = '';
        this.doctorTuesdaySecondWhEnd = '';
        this.doctorWednesdaySecondWhStart = '';
        this.doctorWednesdaySecondWhEnd = '';
        this.doctorThursdaySecondWhStart = '';
        this.doctorThursdaySecondWhEnd = '';
        this.doctorFridaySecondWhStart = '';
        this.doctorFridaySecondWhEnd = '';
        this.doctorSaturdaySecondWhStart = '';
        this.doctorSaturdaySecondWhEnd = '';
        this.doctorSundaySecondWhStart = '';
        this.doctorSundaySecondWhEnd = '';

        this.doctorMondaySplit = false;
        this.doctorTuesdaySplit = false;
        this.doctorWednesdaySplit = false;
        this.doctorThursdaySplit = false;
        this.doctorFridaySplit = false;
        this.doctorSaturdaySplit = false;
        this.doctorSundaySplit = false;

        sessionStorage.setItem('doctorId', doctor.id.toString());
        this.doctorId = doctor.id;
        this.doctorFirstName = doctor.firstName;
        this.doctorLastName = doctor.lastName;
        //this.doctorSpecialty = doctor.specialtyId.toString();
        //this.doctorSubspecialty = doctor.subspecialtyId != null ? doctor.subspecialtyId.toString() : "-1";
        this.doctorSpecialities = [];
        let count = 0;
        this.doctors[index].subspecialties.forEach(sub => {
            const hours = Math.floor(sub.consultationLength / 60);
            const minutes = sub.consultationLength % 60;
            const doctorConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
            this.doctorSpecialities.push(
                {
                    doctorSpecialty: sub.specialtyId.toString(),
                    doctorSubspecialty: sub.subspecialtyId.toString(),
                    doctorConsultationLength: doctorConsultationLength
                }
            );
            this.specialtyChangeDoctor({value: sub.specialtyId.toString()}, count);
            count++;
        });

        doctor.workingHours.forEach(wh => {
            switch (wh.dayNumber){
                case 1:
                    if (this.doctorMondayWorks == false) {
                        this.doctorMondayWhStart = this.getHourFromString(wh.start);
                        this.doctorMondayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorMondaySplit = true;
                        this.doctorMondaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorMondaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorMondayWorks = true;
                    break;
                case 2:
                    if (this.doctorTuesdayWorks == false) {
                        this.doctorTuesdayWhStart = this.getHourFromString(wh.start);
                        this.doctorTuesdayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorTuesdaySplit = true;
                        this.doctorTuesdaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorTuesdaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorTuesdayWorks = true;
                    break;
                case 3:
                    if (this.doctorWednesdayWorks == false) {
                        this.doctorWednesdayWhStart = this.getHourFromString(wh.start);
                        this.doctorWednesdayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorWednesdaySplit = true;
                        this.doctorWednesdaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorWednesdaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorWednesdayWorks = true;
                    break;
                case 4:
                    if (this.doctorThursdayWorks == false) {
                        this.doctorThursdayWhStart = this.getHourFromString(wh.start);
                        this.doctorThursdayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorThursdaySplit = true;
                        this.doctorThursdaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorThursdaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorThursdayWorks = true;
                    break;
                case 5:
                    if (this.doctorFridayWorks == false) {
                        this.doctorFridayWhStart = this.getHourFromString(wh.start);
                        this.doctorFridayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorFridaySplit = true;
                        this.doctorFridaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorFridaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorFridayWorks = true;
                    break;
                case 6:
                    if (this.doctorSaturdayWorks == false) {
                        this.doctorSaturdayWhStart = this.getHourFromString(wh.start);
                        this.doctorSaturdayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorSaturdaySplit = true;
                        this.doctorSaturdaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorSaturdaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorSaturdayWorks = true;
                    break;
                case 0:
                    if (this.doctorSundayWorks == false) {
                        this.doctorSundayWhStart = this.getHourFromString(wh.start);
                        this.doctorSundayWhEnd = this.getHourFromString(wh.end);
                    } else {
                        this.doctorSundaySplit = true;
                        this.doctorSundaySecondWhStart = this.getHourFromString(wh.start);
                        this.doctorSundaySecondWhEnd = this.getHourFromString(wh.end);
                    }
                    this.doctorSundayWorks = true;
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

    specialtyChangeDoctor(selection, index) {
        this.loaderService.show();
        this.doctorSpecialty = selection.value;
        let filter = new IdFilter();
        filter.id = this.doctorSpecialty != null ? parseInt(this.doctorSpecialty) : -1;
        this.subspecialtyService.getAllOfSpecialtyForSelect(filter).subscribe(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].id == "-1") {
                    res.splice(i, 1);
                }
            }
            this.subspecialtyOptionsDoctor[index] = res;
            this.loaderService.hide();
        });
    }

    subspecialtyChangeDoctor(selection, index) {
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
        this.doctorSpecialities[index].doctorConsultationLength = this.convertHoursAndMinutesToString(hours, minutes);
    }

    addDoctor() {
        this.loaderService.show();
        let subspecialtyId = parseInt(this.doctorSubspecialty);
        let doctor = new Doctor();
        doctor.firstName = this.doctorFirstName;
        doctor.lastName = this.doctorLastName;
        doctor.subspecialties = [];
        for (var i = 0; i < this.doctorSpecialities.length; i++) {
            if (this.doctorSpecialities[i].doctorSpecialty != "" && this.doctorSpecialities[i].doctorSubspecialty != "" &&
                this.doctorSpecialities[i].doctorConsultationLength != "") {
                const consultationLengthString = this.doctorSpecialities[i].doctorConsultationLength.split(':');
                let subSpec = new Subspecialty();
                subSpec.subspecialtyId = parseInt(this.doctorSpecialities[i].doctorSubspecialty);
                subSpec.consultationLength = parseInt(consultationLengthString[0], 10) * 60 + parseInt(consultationLengthString[1], 10);
                doctor.subspecialties.push(subSpec);
            }
        }
        doctor.workingHours = [];

        if (this.doctorMondayWorks) doctor.workingHours.push(this.getWorkingHourFromString(1, this.doctorMondayWhStart, this.doctorMondayWhEnd));
        if (this.doctorTuesdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(2, this.doctorTuesdayWhStart, this.doctorTuesdayWhEnd));
        if (this.doctorWednesdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(3, this.doctorWednesdayWhStart, this.doctorWednesdayWhEnd));
        if (this.doctorThursdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(4, this.doctorThursdayWhStart, this.doctorThursdayWhEnd));
        if (this.doctorFridayWorks) doctor.workingHours.push(this.getWorkingHourFromString(5, this.doctorFridayWhStart, this.doctorFridayWhEnd));
        if (this.doctorSaturdayWorks) doctor.workingHours.push(this.getWorkingHourFromString(6, this.doctorSaturdayWhStart, this.doctorSaturdayWhEnd));
        if (this.doctorSundayWorks) doctor.workingHours.push(this.getWorkingHourFromString(0, this.doctorSundayWhStart, this.doctorSundayWhEnd));

        if (this.doctorMondaySplit) doctor.workingHours.push(this.getWorkingHourFromString(1, this.doctorMondaySecondWhStart, this.doctorMondaySecondWhEnd));
        if (this.doctorTuesdaySplit) doctor.workingHours.push(this.getWorkingHourFromString(2, this.doctorTuesdaySecondWhStart, this.doctorTuesdaySecondWhEnd));
        if (this.doctorWednesdaySplit) doctor.workingHours.push(this.getWorkingHourFromString(3, this.doctorWednesdaySecondWhStart, this.doctorWednesdaySecondWhEnd));
        if (this.doctorThursdaySplit) doctor.workingHours.push(this.getWorkingHourFromString(4, this.doctorThursdaySecondWhStart, this.doctorThursdaySecondWhEnd));
        if (this.doctorFridaySplit) doctor.workingHours.push(this.getWorkingHourFromString(5, this.doctorFridaySecondWhStart, this.doctorFridaySecondWhEnd));
        if (this.doctorSaturdaySplit) doctor.workingHours.push(this.getWorkingHourFromString(6, this.doctorSaturdaySecondWhStart, this.doctorSaturdaySecondWhEnd));
        if (this.doctorSundaySplit) doctor.workingHours.push(this.getWorkingHourFromString(0, this.doctorSundaySecondWhStart, this.doctorSundaySecondWhEnd));

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

    addProfessionalSpeciality() {
        let lastElementPosition = this.doctorSpecialities.length - 1;
        if (this.doctorSpecialities[lastElementPosition].doctorSpecialty != "" &&
            this.doctorSpecialities[lastElementPosition].doctorSubspecialty != "" &&
            this.doctorSpecialities[lastElementPosition].doctorConsultationLength != "")
            this.doctorSpecialities.push(
                {
                    doctorSpecialty: "",
                    doctorSubspecialty: "",
                    doctorConsultationLength: ""
                }
            );
    }

    removeProfessionalSpeciality(index) {
        this.subspecialtyOptionsDoctor.splice(index, 1);
        this.doctorSpecialities.splice(index, 1);
    }
}
