import { Component, OnInit } from '@angular/core';
import * as  Chartist from 'chartist';
import {  ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import MarketplaceAbi from '../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../app/contractsData/Marketplace-address.json'
import { ethers } from "ethers"
import NFTAbi from '../../app/contractsData/NFT.json'
import NFTAddress from '../../app/contractsData/NFT-address.json'

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

import {
  ApexPlotOptions,
  ApexLegend,

} from "ng-apexcharts";
import { ContractService } from '../services/contract.service';
import { PanierComponent } from '../panier/panier.component';
import { panier } from '../panier.model';
import { PanierService } from '../services/panier.service';

export type ChartOptions = {
  series1: ApexNonAxisChartSeries;
  chart1: ApexChart;
  responsive1: ApexResponsive[];
  labels1: any;
  

  series2: ApexNonAxisChartSeries;
  chart2: ApexChart;
  labels2: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive2: ApexResponsive | ApexResponsive[];
};



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: any;
  public chartOptions: any;
  @ViewChild("chart") chart2: any;
  public chartOptions2: any;
  marketplace:any = {}
  nft:any = {}
  itemCount :any;
   soldItems :any =0
   sold:any=[]
   showText:any=false
  notsoldItems :any =0
  panierMUSTFAV :any
  itemfav:any
  showimage:any=false
  constructor(private contractService:ContractService,private servicespanier:PanierService) { 
    this.cout();
  }
async cout()
  {
   
    const marketplace =await new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, this.contractService.signer)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft = await new ethers.Contract(NFTAddress.address, NFTAbi.abi, this.contractService.signer)
    this.nft=nft
    console.log("connected")
  
   this.itemCount = await (this.marketplace as any).itemCount()
   for (let indx = 1; indx <= this.itemCount; indx++) {
    const i = await this.marketplace.items(indx)
    if (i.sold ) {
      console.log(i.sold )
      this.soldItems++
      console.log(this.soldItems)
    }
    else  this.notsoldItems++
  }
  this.sold.push(this.soldItems,this.notsoldItems)
      // get uri url from nft contract
    this.servicespanier.MustFav().subscribe((response:any)=>{
      this.panierMUSTFAV=response;
      console.log("hhhhhhhhhhhhhhhhhhhhh")
      console.log(this.panierMUSTFAV.id);
    });
    this.showText=true


if(this.showText){
    for (let i = 1; i <= this.itemCount; i++) {

      
            const item = await (this.marketplace as any).items(i)
            if(item.itemId._hex==this.panierMUSTFAV.id){
              const uri = await (this.nft as any).tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await (this.marketplace as any).getTotalPrice(item.itemId)
        this.itemfav={totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image}
        }}}

        this.showimage=true
     //console.log( this.panierMUSTFAV)

  }
 
  
  startAnimationForLineChart(chart:any){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data:any ) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart:any){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data:any) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {

      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      this.chartOptions2 = {
        series2: [76, 67, 61, 90],
        chart2: {
          height: 390,
          type: "radialBar"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: "30%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show: false
              },
              value: {
                show: false
              }
            }
          }
        },
        colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
        labels2: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
        legend: {
          show: true,
          floating: true,
          fontSize: "16px",
          position: "left",
          offsetX: 50,
          offsetY: 10,
          labels: {
            useSeriesColors: true
          },
          formatter: function(seriesName:any, opts:any) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
          itemMargin: {
            horizontal: 3
          }
        },
        responsive2: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false
              }
            }
          }
        ]
      };


        /* ----------==========     Chart NFT    ==========---------- */

        this.chartOptions = {
          series1: [76, 67 ],
          chart1: {
            width: 380,
            type: "pie"
          },
          labels1: ["SOLD", " UNSOLDE"],
          responsive1: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      
  
      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      // var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      // this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      // var datawebsiteViewsChart = {
      //   labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      //   series: [
      //     [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      //   ]
      // };
      // var optionswebsiteViewsChart = {
      //     axisX: {
      //         showGrid: false
      //     },
      //     low: 0,
      //     high: 1000,
      //     chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      // };
      // var responsiveOptions: any[] = [
      //   ['screen and (max-width: 640px)', {
      //     seriesBarDistance: 5,
      //     axisX: {
      //       labelInterpolationFnc: function (value:any) {
      //         return value[0];
      //       }
      //     }
      //   }]
      // ];
      // var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      // this.startAnimationForBarChart(websiteViewsChart);
  }

}
