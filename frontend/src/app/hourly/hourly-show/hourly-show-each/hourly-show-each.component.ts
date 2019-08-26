import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Hourly } from 'src/app/hourly/hourly.model';
import { Subscription } from 'rxjs';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { DaysService } from '../../../shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from 'src/app/machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';

@Component({
  selector: 'app-hourly-show-each',
  templateUrl: './hourly-show-each.component.html',
  styleUrls: ['./hourly-show-each.component.css']
})
export class HourlyShowEachComponent implements OnInit, OnDestroy {
  @Input() machine: Machine;
  hourly: Hourly[] = [];
  subscriptions: Subscription[]=[];
  isFetching = false;
  isError = false;
  error = '';
  avail=false;
  date = "";


  constructor(
    private hourServ: HourlyService,
    private dayServ: DaysService,
    private auth: AuthService
  ) { }



  ngOnInit() {
    this.getHourly()
    this.date = this.dayServ.stringMonth+"-"+this.dayServ.today+"-"+this.dayServ.year
    this.subscriptions.push(this.hourServ.hourlyChanged.subscribe(()=>{
      setTimeout(()=>{this.getHourly()},50)}
    ))
  }

  getHourly(){
    this.hourly = [];
    this.dayServ.resetDate()
    if (+this.dayServ.today < 10 && this.dayServ.today.length <2){
      this.dayServ.today = "0"+this.dayServ.today
    };
    if (+this.dayServ.month < 10 && this.dayServ.stringMonth.length <2){
      this.dayServ.stringMonth = "0"+this.dayServ.month
    };
    let date = this.dayServ.year +"-"+this.dayServ.stringMonth+"-"+this.dayServ.today;
    this.subscriptions.push(this.hourServ.fetchHourly("date="+date+"&"+"machine="+this.auth.splitJoin(this.machine.machine))
    .subscribe(hourly => {
      this.hourly = hourly;
      this.avail=true
      this.dayServ.dates = [];
      this.hourly.forEach((lot) =>{
        if (+(lot.time[0]+lot.time[1])>12){
          let timeHold = +(lot.time[0]+lot.time[1]) - 12;
          lot.time = timeHold + lot.time.slice(2, -3) + " PM"
        } else if (+(lot.time[0]+lot.time[1]) == 0) {
          let timeHold = +(lot.time[0]+lot.time[1]) + 12;
          lot.time = timeHold + lot.time.slice(2, -3) + " AM"
        } else {
          let timeHold = +(lot.time[0]+lot.time[1])
          lot.time = timeHold + lot.time.slice(2, -3) + " AM"
        }
      })
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  ngOnDestroy(){
    this.subscriptions.forEach((sub)=>{sub.unsubscribe()})
  }


}