import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddNewsComponent } from './add-news/add-news.component';
import { AuthGuard } from './auth.guard';
import { CountryPageComponent } from './country-page/country-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {path: "global", component: HomePageComponent},
  {path: "country/:name", component: CountryPageComponent},
  {path: "signin", component: SigninComponent, canActivate: [SecurePagesGuard]},
  { path: "add-news", component: AddNewsComponent,
  canActivate: [AuthGuard]},
  {path: "",  redirectTo: '/global', pathMatch: 'full'},
  {path: "**", redirectTo: '/global', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
