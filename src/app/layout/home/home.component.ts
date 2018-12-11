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
    public rubro;

    constructor(
        private statisticsService: StatisticsService,
    ){
        super();

        this.day = moment().locale("es").format('dddd');
        this.nrDay = moment().locale("es").date();
        this.month = moment().locale("es").format("MMMM");

        this.rubro = sessionStorage.getItem("rubro");

        this.getStatistics();

        $("a#home-panel").addClass('active');
        $("a#medicos-panel").removeClass('active');
        $("a#especialidades-panel").removeClass('active');
        $("a#pacientes-panel").removeClass('active');
        $("a#calendario-panel").removeClass('active');
        $("a#obrassocial-panel").removeClass('active');
    }

    getStatistics() {
        if (this.rubro == 1) {
            this.statisticsService.getAllStatistics().subscribe(res => {
                this.statistics = res;
                console.log(this.statistics);
            });
        } else if (this.rubro == 2) {
            this.statisticsService.getAllStatisticsHairdress().subscribe(res => {
                this.statistics = res;
                console.log(this.statistics);
            });
        }
    }
}
