import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { GlobalDatacountries } from '../models/globalData';
import { Globaldate } from '../models/globaldate';
import { formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService  {
  dates=new Date();
   currentdate=formatDate(this.dates, 'MM-dd-yyyy','en_IN', 'UTC');
    dateold=this.dates.setDate(this.dates.getDate()-1);
    stringDateOld=formatDate(this.dateold,'MM-dd-yyyy','en_IN', 'UTC');
  //  private dateToday: Date = new Date();

  //  private dateYesterday: Date = new Date();


  private globalDateData="https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
  private globalData=`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${this.stringDateOld}.csv`;
  constructor(private http:HttpClient) {

    // this.dateYesterday = new Date(this.dateYesterday.setDate(this.dateYesterday.getDate() - 1));
    // this.dateold=formatDate(this.dateYesterday, 'MM-dd-yyyy','en_IN', 'UTC');
  }

getGlobaldate(){

 return this.http.get(this.globalDateData,{responseType:'text'}).pipe(map(res=>{
     console.log(typeof(this.stringDateOld));
   let rows=res.split('\n')
   let main={};
    let countryday=rows[0];
    let newcountryday= countryday.split(/,(?=\S)/);
    newcountryday.splice(0,4);
    rows.splice(0,1);
    console.log(newcountryday);
    rows.forEach(resrow=>{
      let cols=resrow.split(/,(?=\S)/);
      let country=cols[1];
      cols.splice(0,4);
      // console.log(country,cols);
      main[country]=[];
      cols.forEach((value, index)=>{
        let dw:Globaldate={
          case: +value,
          country:country,
          date: new Date(Date.parse(newcountryday[index]))

        }
        main[country].push(dw)
      })
    })
    // console.log(main);
    return main;
    }))
}
getGlobalcountries(){
  return this.http.get(this.globalData,{responseType:'text'}).pipe(map(res=>{
    let data:GlobalDatacountries [] = [];
    let raw= {};
    let rows= res.split('\n');
    rows.splice(0,1);
    // console.log(rows);
    rows.forEach(rows=>{
      let cols= rows.split(/,(?=\S)/)
      let countrydata= {
        country: cols[3],
        confirmed: +cols[7],
        deaths: +cols[8],
        recovered: +cols[9],
        active: +cols[10],

      };
      let temp:GlobalDatacountries= raw[countrydata.country];
      if(temp){
        temp.active=countrydata.active + temp.active;
        temp.deaths=countrydata.deaths + temp.deaths;
        temp.recovered=countrydata.recovered + temp.recovered;
        temp.confirmed=countrydata.confirmed + temp.confirmed;
        raw[countrydata.country]=temp;
      }else {
        raw[countrydata.country]=countrydata;
      }
    })
    // console.log(this.currentdate);
    return <GlobalDatacountries[]> Object.values(raw);
  }))

}
}
