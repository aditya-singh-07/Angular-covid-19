import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CovidTrackerComponent } from './components/covid-tracker/covid-tracker.component';
import { CountryComponent } from './country/country.component';

const routes: Routes = [
  { path: '', component:HomeComponent },
  { path: 'country', component:CountryComponent},
  { path: 'covid-tracker', component:CovidTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
