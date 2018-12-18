import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { ImageCroppedEvent } from '../../image-cropper/image-cropper.component';
import { SelectOption } from '../../model/select/select-option.class';
import { RegisterService } from '../../service/register.service';
import * as moment from 'moment';

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html',
    styleUrls: ['./editar.component.css'],
    providers: [RegisterService]
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

    constructor(
        private registerService: RegisterService
    ){
        super();

        this.getCityForSelect();

        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
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
}
