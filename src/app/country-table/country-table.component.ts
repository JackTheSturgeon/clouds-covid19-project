import { Component, HostListener, Input, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { Country } from '../country';
import { ApidbService } from '../services/apidb.service';

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html',
  styleUrls: ['./country-table.component.css']
})
export class CountryTableComponent implements OnInit {

  public countryDataArray: Array<Country>;

  constructor(private apidbService: ApidbService) {
    this.countryDataArray = new Array<Country>();
  }

  ngOnInit(): void {

    this.apidbService.getSummaryData().subscribe((data)=>{
      let result = data.Countries;
      let country_array_temp : Country[] = [];
      for (let i = 0; i < result.length; i++){
        let country = new Country()
          country.countryName = result[i].Country
          country.newCases = result[i].NewConfirmed
          country.totalCases = result[i].TotalConfirmed,
          country.newDeaths = result[i].NewDeaths,
          country.totalDeaths = result[i].TotalDeaths,
          country.newRecovered = result[i].NewRecovered,
          country.totalRecovered = result[i].TotalRecovered
        country_array_temp.push(country);
        this.apidbService.storeCountryData(country);
      }
      this.countryDataArray = country_array_temp;
    });
  }
}
