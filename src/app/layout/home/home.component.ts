import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

    constructor(){
        super();
    }
}
