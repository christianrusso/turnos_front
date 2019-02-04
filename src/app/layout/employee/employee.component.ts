import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { EmployeeService } from '../../service/employee.service';
import { HairdressingEmployeeService } from '../../service/hairdressing.employee.service';
import { Employee } from '../../model/employee.class';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
    selector: 'app-home',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent extends BaseComponent {

    public employees = [];
    public rubro;
    public email;
    public password;

    constructor(
        private employeeService: EmployeeService,
        private hairdressingEmployeeService: HairdressingEmployeeService,
        private loaderService: Ng4LoadingSpinnerService
    ){
        super();

        this.rubro = sessionStorage.getItem("rubro");

        this.getEmployees();

        $("a#empleado-panel").addClass('active');
        $("a#home-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
    }

    async ngAfterViewInit(): Promise<void> {
        await this.loadScript('../assets/empleados.js');
    }

    getEmployees() {
        if (this.rubro == 1) {
            this.employeeService.getAllEmployees().subscribe(res => {
                this.employees = res;
            });
        } else {
            this.hairdressingEmployeeService.getAllEmployees().subscribe(res => {
                this.employees = res;
            });
        }
    }

    showModalAdd() {
        $(".modal-empleado").fadeIn();
    }

    addEmployee() {
        this.loaderService.show();

        let employee = new Employee();

        employee.email = this.email;
        employee.password = this.password;

        if (this.rubro == 1) {
            this.employeeService.register(employee).subscribe(res => {
                this.clean();
            });
        } else {
            this.hairdressingEmployeeService.register(employee).subscribe(res => {
                this.clean();
            });
        }
    }

    removeEmployee(email) {
        this.loaderService.show();

        let employee = new Employee();

        employee.email = email;

        if (this.rubro == 1) {
            this.employeeService.remove(employee).subscribe(res => {
                this.clean();
            });
        } else {
            this.hairdressingEmployeeService.remove(employee).subscribe(res => {
                this.clean();
            });
        }
    }

    clean() {
        this.email = null;
        this.password = null;
        $(".modal-empleado").fadeOut();
        this.getEmployees();
        this.loaderService.hide();
    }
}
