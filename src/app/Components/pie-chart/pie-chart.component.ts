import { Component, Input, OnInit } from '@angular/core';
import {Chart, ChartDataSets, ChartOptions, ChartType} from 'chart.js'
import { Color } from 'chartjs-plugin-datalabels/types/options';
import { Label } from 'ng2-charts';
import { ApidbService } from 'src/app/services/apidb.service';
import { SummaryData } from 'src/app/summary-data';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

    @Input() isHome: boolean = true;
    @Input() country_for_url : string = "";
    @Input() countryName : string = "";

    public pieChartLabels: Label[];

    public pieChartType: ChartType = 'pie';
    public pieChartLegend = true;

    public pieChartData: ChartDataSets[];

    public pieChartOptions: ChartOptions = {
        responsive: true,
    }

  constructor(private apidbService: ApidbService) { 
    this.pieChartLabels = []
    this.pieChartData = []
   }

  ngOnInit(): void {
    this.pieChartLabels = ['Active Cases', 'Dead Cases', 'Recovered Cases'];
    let colors: Color[] = ["#ffe945A1" ,"#ff4545A1", "#45a8ffA1"]

    if (this.isHome){ // We are in home component
      this.apidbService.getLastDaysData("1").subscribe((data_values)=>{
          let cases : number[] = Object.values(data_values.cases);
          let deaths: number[] = Object.values(data_values.deaths);
          let recovered : number[] = Object.values(data_values.recovered);
          let data_array: number[][] = [cases, deaths, recovered];

          this.pieChartData = [{data: data_array, backgroundColor: colors}];
      });
    } 
    else { // We are in country component
      this.apidbService.getSummaryData().subscribe((data_values)=>{
        let countries_json = data_values.Countries;
        let country_data = this.apidbService.getCountryDataByName(countries_json, this.countryName);

        let data_array : number[] = [country_data.TotalConfirmed, country_data.TotalDeaths, country_data.TotalRecovered];
        this.pieChartData = [{data: data_array, backgroundColor: colors}];
      });
    }
}

}
