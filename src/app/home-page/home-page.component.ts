import { Component, OnInit, Input } from '@angular/core';
import { New } from '../new';
import { ApidbService } from '../services/apidb.service';
import { SummaryData } from '../summary-data';
import { User } from '../user';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit {

  summaryData: SummaryData;
  isHome : boolean = true;
  user: User;

  news : New[];

  constructor(public apidbService: ApidbService) {
    this.summaryData = new SummaryData();
    this.news = [];
    this.user = null!;
   }

  ngOnInit(): void {

    this.user = this.apidbService.getCurrentUser();

    this.apidbService.getSummaryData().subscribe((data)=>{
      this.summaryData.newCases = data.Global.NewConfirmed;
      this.summaryData.totalCases = data.Global.TotalConfirmed;
      this.summaryData.newDeaths = data.Global.NewDeaths;
      this.summaryData.totalDeaths = data.Global.TotalDeaths;
      this.summaryData.newRecovered = data.Global.NewRecovered;
      this.summaryData.totalRecovered = data.Global.TotalRecovered;

      this.summaryData.activeCases = this.summaryData.totalCases - this.summaryData.totalRecovered;
      this.summaryData.recoveryRate = Math.round((this.summaryData.totalRecovered / this.summaryData.totalCases)*10000)/100;
      this.summaryData.mortalityRate = Math.round((this.summaryData.totalDeaths/this.summaryData.totalCases)*10000)/100;
    })

    // Getting the news
    this.apidbService.getNews().subscribe((news)=>{
      let country_news = []
      for(let i=0; i<news.length; i++){
        var new_i = news[i] as New;
        if(new_i.country == "Worldwide"){
          country_news.push(new_i);
        }
      }
      this.news = country_news;
    });
  }

}
