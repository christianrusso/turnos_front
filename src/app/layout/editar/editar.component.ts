import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { ImageCroppedEvent } from '../../image-cropper/image-cropper.component';
import * as moment from 'moment';

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html',
    styleUrls: ['./editar.component.css']
})
export class EditarComponent extends BaseComponent {

    logo;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    cropperReady = false;

    constructor(
    ){
        super();

        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
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
}
