import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { EmployeeService } from '../../service/employee.service';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent extends BaseComponent {

    public employees = [];
    public rubro;

    constructor(
        private employeeService: EmployeeService,
    ){
        super();

        this.rubro = sessionStorage.getItem("rubro");

        $("a#empleado-panel").addClass('active');
        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
    }

    getEmployees() {
        if (this.rubro == 1) {
        }
    }
}
