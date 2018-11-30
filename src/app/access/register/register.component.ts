import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Register } from '../../model/register.class';
import { RegisterService } from '../../service/register.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Select2OptionData } from 'ng-select2/ng-select2/ng-select2.interface';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { ImageCroppedEvent } from '../../image-cropper/image-cropper.component';
import { SelectOption } from '../../model/select/select-option.class';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

  public register = new Register();
  public citys: Array<Select2OptionData>;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;
  public rubros: Array<SelectOption> = [{ id: "1", text: "Clinica" }, { id: "2", text: "Peluqueria" }];

  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild('registerForm') mytemplateForm : NgForm;

  constructor(
    private registerService: RegisterService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
    this.getCityForSelect();
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.setCurrentPosition();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.setComponentRestrictions(
            {'country': ['ar']});
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.register.latitude = this.latitude;
          this.register.longitude = this.longitude;
          this.register.address = place.address_components[1].long_name + " " + place.address_components[0].long_name + " " + place.address_components[2].long_name + " " + place.address_components[4].long_name +
            " " + place.address_components[5].long_name;

        });
      });
    });
  }

  getCityForSelect() {
    this.citys=[];
    this.registerService.getCitycSelect().subscribe(res => {
      this.citys=res;
    });
  }

  onSubmit() {
    console.log(this.register);
    if(this.register.password == this.register.scondPassword){
    this.registerService.register(this.register).subscribe(res => {
      this.toastrService.success('Registrado correctamente.');
      this.register= new Register();
       this.cropperReady=false;
       this.mytemplateForm.reset(); 
    });
    }

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.register.logo = this.croppedImage;
  }
  imageLoaded() {
    this.cropperReady = true;
  }
  loadImageFailed() {
    console.log('Load failed');
  }
}
