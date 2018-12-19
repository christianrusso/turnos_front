import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { ImageCroppedEvent } from '../../image-cropper/image-cropper.component';
import { SelectOption } from '../../model/select/select-option.class';
import { RegisterService } from '../../service/register.service';
import { ClinicService } from '../../service/clinic.service';
import { HairdressingService } from '../../service/hairdressing.service';
import * as moment from 'moment';

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html',
    styleUrls: ['./editar.component.css'],
    providers: [RegisterService, ClinicService]
})
export class EditarComponent extends BaseComponent {

    logo;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    cropperReady = false;
    step = 1;
    imageBig;
    image1;
    image2;
    image3;
    image4;
    image5;
    image6;
    image7;
    image8;
    mandatoryPayment = false;
    citys = [];
    public rubros: Array<SelectOption> = [{ id: "1", text: "Clinica" }, { id: "2", text: "Peluqueria" }];
    rubro;
    data;
    day0 = {start: "", end: ""};
    day1 = {start: "", end: ""};
    day2 = {start: "", end: ""};
    day3 = {start: "", end: ""};
    day4 = {start: "", end: ""};
    day5 = {start: "", end: ""};
    day6 = {start: "", end: ""};

    constructor(
        private registerService: RegisterService,
        private clinicService: ClinicService,
        private hairdressingService: HairdressingService
    ){
        super();

        this.getCityForSelect();

        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');

        this.rubro = sessionStorage.getItem("rubro");

        this.getInfo();
    }

    getInfo() {
        this.data={};

        if (this.rubro == 1) {
            this.clinicService.getClinicByFilter(1).subscribe(res => {
                this.data = res[0];
                this.changeCity();
                this.selectDay();
            });
        } else if (this.rubro == 2) {
            this.hairdressingService.getHairdressingByFilter(1).subscribe(res => {
                this.data = res[0];
                this.changeCity();
                this.selectDay();
            });
        }
    }

    changeCity() {
        for (var i = 0; i < this.citys.length; i++) {
            if (this.citys[i].text == this.data.city) {
                this.data.city = this.citys[i].id;
            }
        }
    }

    selectDay() {
        for (var i = 0; i < this.data.openCloseHours.length; i++) {
            if (this.data.openCloseHours[i].dayNumber == 0) {
                this.day0 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 1) {
                this.day1 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 2) {
                this.day2 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 3) {
                this.day3 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 4) {
                this.day4 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 5) {
                this.day5 = this.data.openCloseHours[i];
            } else if (this.data.openCloseHours[i].dayNumber == 6) {
                this.day6 = this.data.openCloseHours[i];
            }
        }
    }

    getCityForSelect() {
        this.citys=[];
        this.registerService.getCitycSelect().subscribe(res => {
            this.citys=res;
        });
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.logo = this.croppedImage;
    }
    imageLoaded() {
        this.cropperReady = true;
    }
    loadImageFailed() {
        console.log('Load failed');
    }

    changeStep(step, stepName) {
        this.step = step;

        (document.querySelector('#firstStep') as HTMLElement).classList.remove('selectedOption');
        (document.querySelector('#secondStep') as HTMLElement).classList.remove('selectedOption');
        (document.querySelector('#thirdStep') as HTMLElement).classList.remove('selectedOption');
        (document.querySelector('#firstStep') as HTMLElement).classList.add('unselectedOption');
        (document.querySelector('#secondStep') as HTMLElement).classList.add('unselectedOption');
        (document.querySelector('#thirdStep') as HTMLElement).classList.add('unselectedOption');

        (document.querySelector('#' + stepName) as HTMLElement).classList.remove('unselectedOption');
        (document.querySelector('#' + stepName) as HTMLElement).classList.add('selectedOption');
    }

    sendData() {
        if (this.rubro == 1) {
            var data = {
                "Address": this.data.address,
                "Description": this.data.description,
                "CityId": this.data.city,
                "Name": this.data.name
            }
            this.clinicService.sendClinicData(data).subscribe(res => {
            });
        } else if (this.rubro == 2) {
            this.hairdressingService.getHairdressingByFilter(1).subscribe(res => {
            });
        }
    }
}
