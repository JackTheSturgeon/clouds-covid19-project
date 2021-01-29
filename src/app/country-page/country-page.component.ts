import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { New } from '../new';
import { ApidbService } from '../services/apidb.service';
import { SummaryData } from '../summary-data';
import { User } from '../user';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  styleUrls: ['./country-page.component.css']
})
export class CountryPageComponent implements OnInit {
  public isHome : boolean = false;
  public api_parsed_countryName = "";

  public countryName : string;
  public summaryData: SummaryData;

  user: User;

  news : New[];

  constructor(private router: Router, 
    public apidbService: ApidbService) { 

    this.countryName = "";
    this.summaryData = new SummaryData();
    this.news = []
    this.user = apidbService.getCurrentUser();

  }

  async ngOnInit(): Promise<void> {
    let names_array : string[] = this.getNameFromUrl();
    this.countryName = names_array[0]
    this.api_parsed_countryName = names_array[1];

    if (this.countryName==="United States of America"){
      this.api_parsed_countryName = "us"
    }

    let countryClass = await this.apidbService.getCountryData(this.countryName);
    this.summaryData.newCases = countryClass.newCases;
    this.summaryData.totalCases = countryClass.totalCases;
    this.summaryData.newDeaths = countryClass.newDeaths;
    this.summaryData.totalDeaths = countryClass.totalDeaths;
    this.summaryData.newRecovered = countryClass.newRecovered;
    this.summaryData.totalRecovered = countryClass.totalRecovered;
    this.summaryData.activeCases = this.summaryData.totalCases - this.summaryData.totalRecovered;
    this.summaryData.recoveryRate = Math.round((this.summaryData.totalRecovered / this.summaryData.totalCases)*10000)/100;
    this.summaryData.mortalityRate = Math.round((this.summaryData.totalDeaths/this.summaryData.totalCases)*10000)/100;
    
    // Getting the news
    this.apidbService.getNews().subscribe((news)=>{
      let country_news = []
      for(let i=0; i<news.length; i++){
        var new_i = news[i] as New;
        if(new_i.country == this.countryName){
          country_news.push(new_i);
        }
      }
      this.news = country_news;
    });
  }

  public getNameFromUrl(){
    let url = this.router.url;
    let url_array = url.split("/");
    
    let split_space_name = url_array[url_array.length-1];
    let space_name_array = split_space_name.split("%20");
    let name = "";
    name = space_name_array[0];
    let api_parsed_name= name;

    if (space_name_array.length == 1){
      return [name,api_parsed_name];
    } else {
      for (let i = 1; i<space_name_array.length; i++){
        name += (" "+space_name_array[i]);
        api_parsed_name += ("-"+space_name_array[i]);
      }
      return [name,api_parsed_name.toLowerCase()];
    }
  }

}
