import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDatacountries } from 'src/app/models/globalData';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleChartInterface } from 'ng2-google-charts';
import { animation } from '@angular/animations';
@Component({
  selector: 'app-covid-tracker',
  templateUrl: './covid-tracker.component.html',
  styleUrls: ['./covid-tracker.component.scss']
})
export class CovidTrackerComponent implements OnInit {
  loading=true;
  islsoading:boolean=false;
  country:string[]=[];
  totalconfirmcase=0;
  totalactivecase=0;
  totalrecoveredcase=0;
  totaldeathcase=0;
  globalData:GlobalDatacountries[];
  piechart:GoogleChartInterface={
    chartType:'pieChart'
  }
  columnchart:GoogleChartInterface={
    chartType:'ColumnChart'
  }
  GeoChart:GoogleChartInterface={
    chartType:'GeoChart'
  }
  constructor(private dataService:DataServiceService) { }
  ngOnInit(): void {
    this.islsoading=true;
    this.dataService.getGlobalcountries().subscribe({
      next: (res)=>{

        this.globalData=res;
        res.forEach(result =>{
          this.country.push(result.country);
          if(!Number.isNaN(result.confirmed)){
            this.totalactivecase+=result.active
            this.totalconfirmcase+=result.confirmed
            this.totalrecoveredcase+=result.recovered
            this.totaldeathcase+=result.deaths
          }
        })
        this.loading=false;

        this.islsoading=false;

        this.chart('R');


        // console.log(res);
      }
    })



  }

  chart(casetypes : string){
    let datatable=[];

  datatable.push(["country","Recover Case"])
  this.globalData.forEach(res=>{
    let value :number;
    if(casetypes == 'R')
      if(res.recovered >500)
      value=res.recovered

    if(casetypes == 'A')
      if(res.active >500)
      value=res.active

    if(casetypes == 'C')
      if(res.confirmed >500)
      value=res.confirmed

    if(casetypes == 'D')
      if(res.deaths >500)
      value=res.deaths

    datatable.push([
      res.country,value
    ])

    console.log(value);
  })

  // console.log(datatable);
    this.piechart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height:400,
        animation: {
          duration:1000,
          easingh: 'out',
        }
      },

    };
    // this.columnchart = {
    //   chartType: 'ColumnChart',
    //   dataTable: datatable,
    //   //firstRowIsData: true,
    //   options: {
    //     height:400

    //   },
    // };
    this.GeoChart = {
      chartType: 'GeoChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        showTip: true,
        height:400,
        animation: {
          duration:1000,
          easingh: 'out',
        }

      },
    };

  }

onchange(casetype: HTMLInputElement){
  console.log(casetype.value);
  this.chart(casetype.value);
}
}
