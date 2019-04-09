import { Component } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { StatisticsService } from '../../service/statistics.service';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

    public day;
    public nrDay;
    public month;
    public statistics;
    
    constructor(
        private statisticsService: StatisticsService,
    ){
        super();

        this.day = moment().locale("es").format('dddd');
        this.nrDay = moment().locale("es").date();
        this.month = moment().locale("es").format("MMMM");

        this.getStatistics();

        $("a#home-panel").addClass('active');
        $("a#empleado-panel").removeClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
    }

    getStatistics() {
        this.statisticsService.getAllStatisticsHairdress().subscribe(res => {
            this.statistics = res;
            console.log(this.statistics);
        });
    }
}
