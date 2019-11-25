import { Component, OnInit } from '@angular/core';
import { Hourly } from '../../hourly.model';
import { Subscription } from 'rxjs';
import { Params, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { HourlyService } from '../../hourly.service';
import { DaysService } from 'src/app/shared/days/days.service';

@Component({
  selector: 'app-hourly-find-show',
  templateUrl: './hourly-find-show.component.html',
  styleUrls: ['./hourly-find-show.component.css']
})
export class HourlyFindShowComponent implements OnInit {
  hourly: Hourly[] = [];
  splitLots: Hourly[][] = [];
  hourlyHold: Hourly[] = [];
  lastMachine = ""; 
  oneDate = false;
  machSearch = false;
  oneJob = false;
  isFetching = false;
  isError = false;
  error = '';
  id = '';
  search = '';
  subscriptions: Subscription[] =[];
  total: number = 0;
  quantity: Hourly;
  lastDate: Date;
  prodTime = [];
  startTime = ""

  constructor(
    private auth: AuthService,
    private hourServ: HourlyService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(
        (params: Params) =>{
          this.search = params['search'];
          if (this.search.includes("date")){
            
          }
          this.getHourly();
        }
      )
    );
    this.subscriptions.push(
      this.auth.authChanged.subscribe(
        ()=>{
          this.id = this.auth.user
        }
      )
    );
  }
  
  splitByMachine(){
    this.hourly.forEach( 
      (lot) =>{
        if (lot.machine==this.lastMachine && lot == this.hourly[this.hourly.length-1]){
          this.hourlyHold.push(lot);
          this.splitLots.push(this.hourlyHold);
        } else if(lot == this.hourly[this.hourly.length-1]){
          this.splitLots.push(this.hourlyHold);
          this.hourlyHold = [];
          this.hourlyHold.push(lot);
          this.splitLots.push(this.hourlyHold);
        } else if (lot.machine==this.lastMachine){ 
          this.hourlyHold.push(lot);
        } else { 
          this.splitLots.push(this.hourlyHold);
          this.lastMachine = lot.machine;
          this.hourlyHold = [];
          this.hourlyHold.push(lot);
        }
      }
    );
  }

  splitByDate(){
    this.hourly.forEach( 
      (lot) =>{
        if (this.dayServ.dashToSlash(lot.date)==this.lastDate && lot == this.hourly[this.hourly.length-1]){
          this.hourlyHold.push(lot);
          this.splitLots.push(this.hourlyHold);
        } else if(lot == this.hourly[this.hourly.length-1]){
          this.splitLots.push(this.hourlyHold);
          this.hourlyHold = [];
          this.hourlyHold.push(lot);
          this.splitLots.push(this.hourlyHold);
        } else if (this.dayServ.dashToSlash(lot.date) == this.lastDate){ 
          this.hourlyHold.push(lot);
        } else { 
          this.splitLots.push(this.hourlyHold);
          this.lastDate = this.dayServ.dashToSlash(lot.date);
          this.hourlyHold = [];
          this.hourlyHold.push(lot);
        }
      }
    );
  }

  getHourly() {
    this.isFetching = true;
    this.hourServ.fetchHourly(this.search)
      .subscribe(hourly => {
        this.hourly = hourly;
        this.dayServ.dates = [];
        this.hourly.forEach((lot) => {
          let startTime = "07:45:00"
          let minHold = +(lot.time[3]+lot.time[4])-45+"";
          let hourHold = +(lot.time[0]+lot.time[1])-7+"";
          let timeHold = "";
          if (+minHold < 0){
            minHold = +minHold+60+"";
            hourHold = +hourHold-1+"";
          }
          timeHold = hourHold + ":" + minHold
          this.prodTime.push(timeHold);
          if (+(lot.time[0]+lot.time[1])==12) {
            lot.time = lot.time + " PM"
          } else if (+(lot.time[0]+lot.time[1])>11){
            let timeHold = +(lot.time[0]+lot.time[1]) - 12;
            lot.time = timeHold + lot.time.slice(2, 5) + " PM"
          } else if (+(lot.time[0]+lot.time[1]) == 0) {
            let timeHold = +(lot.time[0]+lot.time[1]) + 12;
            lot.time = timeHold + lot.time.slice(2, 5) + " AM"
          } else {
            let timeHold = +(lot.time[0]+lot.time[1])
            lot.time = timeHold + lot.time.slice(2, 5) + " AM"
          };
          this.dayServ.dates.push(this.dayServ.dashToSlash(lot.date))
        })
        if (this.search.includes("date") && this.search.includes("jobNumber")){
          this.machSearch = true;
          this.oneDate = true;
          let hold = [];
          this.hourly.forEach((lot)=>{
            hold.push(lot.quantity)
          })
          this.total = Math.max.apply(Math, hold)
        }
        if (this.search.includes("machine")){
          this.machSearch = true
        }
        if (this.search.includes("jobNumber") && !this.search.includes("date")){
          this.lastDate = this.dayServ.dashToSlash(this.hourly[0].date);
          this.oneJob = true;
          this.machSearch = true;
          this.splitByDate();
        }
        this.isFetching = false;
        if (!this.machSearch){
          this.lastMachine = hourly[0].machine;
          this.splitByMachine();
        }
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
