import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Chart, ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import { Label } from 'ng2-charts';
import { ApidbService } from 'src/app/services/apidb.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() isHome: boolean = true;
  @Input() country : string = "";

    public barChartLabels: Label[];

    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    // run npm i chartjs-plugin-datalabels
    //public barChartPlugins = [pluginDataLabels];

    public barChartData: ChartDataSets[];

    public barChartOptions: ChartOptions = {
        responsive: true,
    }

  constructor(private apidbService: ApidbService) { 
    this.barChartLabels = []
    this.barChartData = []
  }

  ngOnInit(): void {

    if (this.isHome){
      this.apidbService.getLastDaysData("8").subscribe((data_values)=>{
        let dates_array_initial = Object.keys(data_values["cases"])
        let deaths_array_initial : number[] = Object.values(data_values.deaths)
        let cases_array_initial : number[] = Object.values(data_values.cases)
        let recovered_array_initial : number[] = Object.values(data_values.recovered)

        let deaths_array : number[] = [];
        let cases_array : number[] = [];
        let recovered_array : number[] = [];

        for (var i = 0; i < dates_array_initial.length-2; i++){
          this.barChartLabels.push(dates_array_initial[i+1]);
          deaths_array.push(deaths_array_initial[i+1]-deaths_array_initial[i]);
          cases_array.push(cases_array_initial[i+1]-cases_array_initial[i]);
          recovered_array.push(recovered_array_initial[i+1]-recovered_array_initial[i]);
        }

        this.barChartData = [
          {data: deaths_array, label: 'Daily Deaths', backgroundColor: "#ff4545A1"},
          {data: cases_array, label: 'Daily New Cases', backgroundColor: "#ffe945A1"},
          {data: recovered_array, label: 'Daily Recovered', backgroundColor: "#45a8ffA1"}
        ];
      })
    } 
    else { //We are in country component
      this.apidbService.dayoneCountry(this.country).subscribe((data_values)=>{
        let deaths_array : number[] = [];
        let cases_array : number[] = [];
        let recovered_array : number[] = [];
        let N : number = data_values.length;

        for (let i = 1; i<8; i++){
          let date_split = (data_values[N-i].Date).split("T");
          let date = date_split[0];
          this.barChartLabels.unshift(date); 

          deaths_array.unshift(data_values[N-i].Deaths - data_values[N-i-1].Deaths);
          cases_array.unshift(data_values[N-i].Confirmed - data_values[N-i-1].Confirmed);
          recovered_array.unshift(data_values[N-i].Recovered - data_values[N-i-1].Recovered);
        }

        this.barChartData = [
          {data: deaths_array, label: 'Daily Deaths', backgroundColor: "#ff4545A1"},
          {data: cases_array, label: 'Daily New Cases', backgroundColor: "#ffe945A1"},
          {data: recovered_array, label: 'Daily Recovered', backgroundColor: "#45a8ffA1"}
        ];
      });
    }
  }
}
