import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { New } from '../new';
import { ApidbService } from '../services/apidb.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  user: User;

  date: any;
  country: string;
  description: string;

  constructor(public apidbService: ApidbService) { 
    this.country = "";
    this.description = "";
    this.user = null!;
  }

  ngOnInit(): void {
    this.user = this.apidbService.getCurrentUser();
  }

  addNew(){
    const currentNew: New = {
      date: new Date(this.date),
      country: this.country,
      description: this.description,
      author_uid: this.user.uid,
      author_displayName: this.user.displayName,
      author_email: this.user.email
    };
    this.apidbService.addNew(currentNew);
    this.date = undefined;
    this.description = undefined!;
    this.country = undefined!;
  }

}
