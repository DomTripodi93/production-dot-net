import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { Hourly } from 'src/app/hourly/hourly.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from '../days.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-days-hourly',
  templateUrl: './days-hourly.component.html',
  styleUrls: ['./days-hourly.component.css']
})
export class DaysHourlyComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  searchHold = [];
  search = '';
  hourly: Hourly[] = [];
  isFetching = false;
  isError=false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private hourlyServ: HourlyService,
    private dayServ: DaysService,
    private auth: AuthService
    ) { }

  ngOnInit() {
    this.auth.hideButton(0)
    this.subscription = this.route.parent.params.subscribe((params: Params) =>{
      this.dayServ.month = params['month'];
      this.dayServ.today = params['day'];
      this.dayServ.year = params['year'];
      this.searchHold.push(this.dayServ.year);
      this.dayServ.day = new Date(this.dayServ.year, +this.dayServ.month-1, +this.dayServ.today).getDay()
      this.dayServ.stringMonth = ""+this.dayServ.month;
      if (this.dayServ.month < 10 && this.dayServ.stringMonth.length <2){
        this.dayServ.stringMonth = "0" + this.dayServ.month;
      }
      this.searchHold.push(this.dayServ.stringMonth);
      if (+this.dayServ.today < 10 && this.dayServ.today.length <2){
        this.dayServ.today = "0" + this.dayServ.today;
      }
      this.searchHold.push(this.dayServ.today);
      this.search = this.searchHold.join("-");
      this.hourlyServ.fetchHourly("date="+this.search)
        .subscribe((hourly) => {
          this.hourly = hourly;
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
        })
    });
  }


  ngOnDestroy(){
    this.auth.showButton(0)
  }

}