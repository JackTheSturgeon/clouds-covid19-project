import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import { Country } from '../country';
import { User } from '../user';
import { Router } from '@angular/router';
import { New } from '../new';

@Injectable({
  providedIn: 'root'
})
export class ApidbService {

  readonly ROOT_URL = "https://api.covid19api.com"
  readonly NEW_API = "https://corona.lmao.ninja/v2/historical/all"

  private user: User;

  constructor(private http: HttpClient, 
    private firestore : AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router) {
      this.user = null!;
  }

  // All Sign in and user related methods

  // Method for a user to ask for its eligibility which lets the admin know that he asked for it
  // The admin has to manually change the eligibility of the user in question
  public askForEligibility(){
    this.firestore.collection("asked_eligibility").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
    }, {merge: true});
  }

  public async signInWithGoogle(){
    const credentials = await <any>this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())

    let doc = await this.firestore.collection("users").doc(credentials.user.uid).get().toPromise();
    if (!doc.exists){
      this.user = {
        uid: credentials.user.uid,
        displayName: credentials.user.displayName,
        email: credentials.user.email,
        eligible: true
      };
      this.updateUserData();
    }
    else {
      let docObject = <any>doc.data();
      this.user = {
        uid: docObject["uid"],
        displayName: docObject["displayName"],
        email: docObject["email"],
        eligible: docObject["eligible"]
      }
    }
    localStorage.setItem("user", JSON.stringify(this.user));
    this.router.navigate(["global"])
  }

  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
      eligible: this.user.eligible,
    }, {merge: true});
  }

  getCurrentUser(){
    if(this.user==null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user")!);
    }
    return this.user;
  }

  userSignedIn(): boolean{
    const user = localStorage.getItem("user");
    if (user == null){
      return false;
    }
    else{
      return JSON.parse(user) != null;
    }
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null!;
  }

  getNews(){
    return this.firestore
    .collection("news", ref => ref.orderBy('date', 'desc'))
    .valueChanges();
  }

  getUser(uid:string){
    return this.firestore.collection("users").doc(uid).valueChanges();
  }

  addNew(currentNew: New){
    let randomId = this.firestore.createId();
    this.firestore.collection("news").doc(randomId).set({
      date: currentNew.date,
      description: currentNew.description,
      country: currentNew.country,
      author_uid: currentNew.author_uid,
      author_displayName: currentNew.author_displayName,
      author_email: currentNew.author_email
    });
  }

  // All API calls

  public storeCountryData(country : Country){
    let currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
    this.firestore.collection("countries").doc(country.countryName).set({
      date: currentDate,
      newCases: country.newCases,
      newDeaths: country.newDeaths,
      newRecovered: country.newRecovered,
      totalCases: country.totalCases,
      totalDeaths: country.totalDeaths,
      totalRecovered: country.totalRecovered
    }, { merge: true});
  }

  // Responds to the challenge 1
  public async getCountryData(countryName: string){
    let doc = await this.firestore.collection("countries").doc(countryName).get().toPromise();
    let country = new Country();
    country.countryName = countryName;

    if (!doc.exists){ //We havent got nothing on the country
      let data = await this.getSummaryData().toPromise();

      let countries_json = data.Countries;
      let country_data = this.getCountryDataByName(countries_json, countryName);
      
      country.newCases = country_data.NewConfirmed;
      country.totalCases = country_data.TotalConfirmed;
      country.newDeaths = country_data.NewDeaths;
      country.totalDeaths = country_data.TotalDeaths;
      country.newRecovered = country_data.NewRecovered;
      country.totalRecovered = country_data.TotalRecovered;

      this.storeCountryData(country);
    }
    else {
      // Verification of staleness of data
      let docObject = <any>doc.data();
      let storedDate = new Date(docObject["date"]);
      let currentDate = new Date();

      if (storedDate.getTime() !== currentDate.getTime()){
        let data = await this.getSummaryData().toPromise();
        let countries_json = data.Countries;
        let country_data = this.getCountryDataByName(countries_json, countryName);
        
        country.newCases = country_data.NewConfirmed;
        country.totalCases = country_data.TotalConfirmed;
        country.newDeaths = country_data.NewDeaths;
        country.totalDeaths = country_data.TotalDeaths;
        country.newRecovered = country_data.NewRecovered;
        country.totalRecovered = country_data.TotalRecovered;

        this.storeCountryData(country);
      }
      else {
        country.newCases = docObject["newCases"]
        country.newDeaths = docObject["newDeaths"]
        country.newRecovered = docObject["newRecovered"]
        country.totalCases = docObject["totalCases"]
        country.totalDeaths = docObject["totalDeaths"]
        country.totalRecovered = docObject["totalRecovered"]
      }
    }

    return country;
    }

  public getSummaryData(){
    return this.http.get<any>(this.ROOT_URL + '/summary');
  }

  public getLastDaysData(n_days: string){
    return this.http.get<any>(this.NEW_API + "?lastdays=" + n_days);
  }

  public dayoneCountry(country: string){
    return this.http.get<any>("https://api.covid19api.com/total/dayone/country/"+country);
  }

  public getCountryDataByName(jsonObject : any, name : string){
    return jsonObject.find((element: { Country: string; }) => element.Country === name);
  }
}
