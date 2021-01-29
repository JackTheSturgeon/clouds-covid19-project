import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Chart, ChartDataSets, ChartOptions, ChartType} from 'chart.js'
import { Label } from 'ng2-charts';
import { ApidbService } from 'src/app/services/apidb.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() isHome: boolean = true;
  @Input() country : string = "";

    public lineChartLabels: Label[];

    public lineChartType: ChartType = 'line';
    public lineChartLegend = true;

    public lineChartColor:any = [
      {
        backgroundColor: 'rgba(255, 235, 205,0.5)' 
      },
      {
        backgroundColor: 'rgba(236, 248, 127,0.7)'
      },
      {
        backgroundColor: 'rgba(255, 150, 54,1)'
      }
    ]

    public lineChartData: ChartDataSets[];

    public lineChartOptions: ChartOptions = {
        responsive: true,
    }

  constructor(private apidbService: ApidbService) {
      this.lineChartData = [];
      this.lineChartLabels = [];
   }

  ngOnInit(): void {

    if (this.isHome){
      let initialDate = new Date('04/13/2020');
      let currentDate = new Date();
      var difference = currentDate.getTime() - initialDate.getTime();
      // We recover the days difference between the dates
      var days = Math.round(difference / (1000 * 3600 * 24));

      this.apidbService.getLastDaysData(days.toString()).subscribe((data_values)=>{
          this.lineChartLabels = Object.keys(data_values["cases"])
          let deaths_array : number[] = Object.values(data_values.deaths)
          let cases_array : number[] = Object.values(data_values.cases)
          let recovered_array : number[] = Object.values(data_values.recovered)
    
          this.lineChartData = [
            {data: deaths_array, label: 'Daily Deaths'},
            {data: cases_array, label: 'Daily New Cases'},
            {data: recovered_array, label: 'Daily Recovered'}
          ];
        })
    } 
    else {
      this.apidbService.dayoneCountry(this.country).subscribe((data_values)=>{
        let deaths_array : number[] = [];
        let cases_array : number[] = [];
        let recovered_array : number[] = [];

        for (let i = 0; i < data_values.length; i+=4){
          // Collecting all the dates
          let date_split = (data_values[i].Date).split("T");
          let date = date_split[0];
          this.lineChartLabels.push(date);

          deaths_array.push(data_values[i].Deaths);
          cases_array.push(data_values[i].Confirmed);
          recovered_array.push(data_values[i].Recovered);
        }

        this.lineChartData = [
          {data: deaths_array, label: 'Daily Deaths'},
          {data: cases_array, label: 'Daily New Cases'},
          {data: recovered_array, label: 'Daily Recovered'}
        ];
      });
    }
  }

}
