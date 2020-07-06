import { Component, OnInit, Input } from '@angular/core';
import { GlobalDatacountries } from '../models/globalData';
import { DataServiceService } from '../services/data-service.service';
import { Globaldate } from '../models/globaldate';
import { GoogleChartInterface } from 'ng2-google-charts';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  isloading:boolean=false;
  loading=true;
  totalconfirmcase=0;
  totalactivecase=0;
  totalrecoveredcase=0;
  totaldeathcase=0;
  country:string[]=[];
  globalData:GlobalDatacountries[];
  globaldatedata;
  selectcountry:Globaldate[];
  linechart:GoogleChartInterface={
    chartType:'LineChart'
  }
  constructor(private dataService:DataServiceService) { }

  ngOnInit():void{

    this.dataService.getGlobalcountries().subscribe(
     res=>{
        this.globalData=res;

        this.globalData.forEach(result =>{
         this.country.push(result.country);
         if(result.country == 'US'){
          this.totalactivecase=result.active;
          this.totalrecoveredcase=result.recovered;
          this.totalconfirmcase=result.confirmed;
          this.totaldeathcase=result.deaths;
        }
        })
      }
    );
    this.isloading=true;
        this.dataService.getGlobaldate().subscribe((res)=>{
          this.isloading=false;
      this.globaldatedata=res;
      this.selectcountry=this.globaldatedata['US'];
      this.loading=false;
      this.chart();
    })

    // merge(
    //   this.dataService.getGlobaldate().pipe(map(res=>{
    //     this.globaldatedata=res;
    //   })
    //   ),
    //   this.dataService.getGlobalcountries().pipe(map(res=>{
    //     this.globalData=res;
    //     this.globalData.forEach(result =>{
    //      this.country.push(result.country);
    //      if(result.country == 'US'){
    //             this.totalactivecase=result.active;
    //             this.totalrecoveredcase=result.recovered;
    //             this.totalconfirmcase=result.confirmed;
    //             this.totaldeathcase=result.deaths;
    //           }
    //   })
    // }))
    // ).subscribe({
    //   complete: ()=>{
    //     this.selectcountry=this.globaldatedata['US'];
    //     this.loading=false;
    //     this.showData('US');
    //     this.chart();

    //   }
    // })

  }
  showData(data:string){
    console.log(data);
    this.globalData.forEach(result => {
      if(result.country == data){
        this.totalactivecase=result.active;
        this.totalrecoveredcase=result.recovered;
        this.totalconfirmcase=result.confirmed;
        this.totaldeathcase=result.deaths;
      }

    })
    this.selectcountry=this.globaldatedata[data];
    this.chart();
    // console.log(this.selectcountry);
  }


chart(){
  let dataTable= [];

  dataTable.push(['case','date'])
  this.selectcountry.forEach(res =>{
    dataTable.push([
     res.case,res.date
   ])
  })

  console.log(dataTable);
    this.linechart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height:400
      },
    };

  }

}
