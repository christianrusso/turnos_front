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
    imageChangedEvent1: any = '';
    imageChangedEvent2: any = '';
    imageChangedEvent3: any = '';
    imageChangedEvent4: any = '';
    imageChangedEvent5: any = '';
    imageChangedEvent6: any = '';
    imageChangedEvent7: any = '';
    imageChangedEvent8: any = '';
    imageChangedEvent9: any = '';
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
    day0 = {dayNumber: 0, start: "", end: ""};
    day1 = {dayNumber: 1, start: "", end: ""};
    day2 = {dayNumber: 2, start: "", end: ""};
    day3 = {dayNumber: 3, start: "", end: ""};
    day4 = {dayNumber: 4, start: "", end: ""};
    day5 = {dayNumber: 5, start: "", end: ""};
    day6 = {dayNumber: 6, start: "", end: ""};
    newPassword;
    oldPassword;

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
    fileChangeEvent1(event: any): void {
        this.imageChangedEvent1 = event;
    }
    fileChangeEvent2(event: any): void {
        this.imageChangedEvent2 = event;
    }
    fileChangeEvent3(event: any): void {
        this.imageChangedEvent3 = event;
    }
    fileChangeEvent4(event: any): void {
        this.imageChangedEvent4 = event;
    }
    fileChangeEvent5(event: any): void {
        this.imageChangedEvent5 = event;
    }
    fileChangeEvent6(event: any): void {
        this.imageChangedEvent6 = event;
    }
    fileChangeEvent7(event: any): void {
        this.imageChangedEvent7 = event;
    }
    fileChangeEvent8(event: any): void {
        this.imageChangedEvent8 = event;
    }
    fileChangeEvent9(event: any): void {
        this.imageChangedEvent9 = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.logo = this.croppedImage;
    }
    imageCroppedSubImage(event: ImageCroppedEvent, sub) {
        this.croppedImage = event.base64;
        if (sub == 1) {
            this.imageBig = this.croppedImage;
        }
        if (sub == 2) {
            this.image1 = this.croppedImage;
        }
        if (sub == 3) {
            this.image2 = this.croppedImage;
        }
        if (sub == 4) {
            this.image3 = this.croppedImage;
        }
        if (sub == 5) {
            this.image4 = this.croppedImage;
        }
        if (sub == 6) {
            this.image5 = this.croppedImage;
        }
        if (sub == 7) {
            this.image6 = this.croppedImage;
        }
        if (sub == 8) {
            this.image7 = this.croppedImage;
        }
        if (sub == 9) {
            this.image8 = this.croppedImage;
        }
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
        var data = {
            "Address": this.data.address,
            "Description": this.data.description,
            "CityId": this.data.city,
            "Name": this.data.name,
            "NewPassword": this.newPassword,
            "OldPassword": this.oldPassword,
            "Logo": "",
            "Latitude": this.data.latitude,
            "Longitude": this.data.longitude,
            "OpenCloseHours": [],
            "Images": []
        };
        if (this.logo != "" && this.logo != null) {
            data.Logo = this.logo;
        }
        if (this.imageBig != "" && this.imageBig != null) {
            data.Images.push(this.imageBig);
        }
        if (this.image1 != "" && this.image1 != null) {
            data.Images.push(this.image1);
        }
        if (this.image2 != "" && this.image2 != null) {
            data.Images.push(this.image2);
        }
        if (this.image3 != "" && this.image3 != null) {
            data.Images.push(this.image3);
        }
        if (this.image4 != "" && this.image4 != null) {
            data.Images.push(this.image4);
        }
        if (this.image5 != "" && this.image5 != null) {
            data.Images.push(this.image5);
        }
        if (this.image6 != "" && this.image6 != null) {
            data.Images.push(this.image6);
        }
        if (this.image7 != "" && this.image7 != null) {
            data.Images.push(this.image7);
        }
        if (this.image8 != "" && this.image8 != null) {
            data.Images.push(this.image8);
        }
        if (this.day0.start != "" && this.day0.end != "") {
            data.OpenCloseHours.push(this.day0);
        }
        if (this.day1.start != "" && this.day1.end != "") {
            data.OpenCloseHours.push(this.day1);
        }
        if (this.day2.start != "" && this.day2.end != "") {
            data.OpenCloseHours.push(this.day2);
        }
        if (this.day3.start != "" && this.day3.end != "") {
            data.OpenCloseHours.push(this.day3);
        }
        if (this.day4.start != "" && this.day4.end != "") {
            data.OpenCloseHours.push(this.day4);
        }
        if (this.day5.start != "" && this.day5.end != "") {
            data.OpenCloseHours.push(this.day5);
        }
        if (this.day6.start != "" && this.day6.end != "") {
            data.OpenCloseHours.push(this.day6);
        }

        if (this.rubro == 1) {
            this.clinicService.sendClinicData(data).subscribe(res => {
                this.newPassword = "";
                this.oldPassword = "";
            });
        } else if (this.rubro == 2) {
            this.hairdressingService.sendClinicData(data).subscribe(res => {
                this.newPassword = "";
                this.oldPassword = "";
            });
        }
    }
}
