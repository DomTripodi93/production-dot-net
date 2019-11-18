import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { Production } from '../../production.model';
import { ProductionDate } from '../../productionDate.model';
import { ProductionService } from '../../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';

@Component({
  selector: 'app-production-calender',
  templateUrl: './production-calender.component.html',
  styleUrls: ['./production-calender.component.css']
})
export class ProductionCalenderComponent implements OnInit {
  @Input() machine: Machine;
  @Input() month: number;
  @ViewChild('newMonth') newMonthForm: NgForm;
  production: Production[];
  date = new Date();
  today = this.date.getDate();
  monthNum: number;
  monthHold: string;
  year = this.date.getFullYear();
  day = this.date.getDay();
  defaultMonth = ""; 
  oldMonth: number = this.month;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  numberOfDays: number;
  monthDays = []
  firstDayOfMonth = [];
  dayAvg: number;
  nightAvg: number;
  overNightAvg: number;
  total: number



  constructor(
    public auth: AuthService,
    private router: Router,
    public dayServ: DaysService,
    public proServ: ProductionService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.monthNum = this.month + 1;
    this.monthHold = "" + this.monthNum;
    if (this.month < 9){
      this.monthHold ="0"+this.monthHold;
    }
    this.defaultMonth = this.year + "-" + this.monthHold;
    this.setDate();
    this.getProduction();
    this.proServ.proChanged.subscribe(()=>{
      this.getProduction();
    })
  }

  getProduction(){
    let search = "mach=" + this.auth.splitJoin(this.machine.machine) 
      + "&job=" + this.machine.currentJob 
      + "&op=" + this.opServ.slashToDash(this.machine.currentOp);
    this.proServ.fetchProduction(search).subscribe(prod=>{
      this.production = prod;
      this.setAverage();
    })
  }

  setDate(){
    this.daysInMonth(this.year, this.month+1);
    this.monthDays = _.range(1, this.numberOfDays + 1);
    let firstDay = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = _.range(0, firstDay.getDay());
  }

  daysInMonth(year: number, month: number){
    this.numberOfDays = new Date(year, month, 0).getDate();
  }

  setAverage(){
    this.total = 0;
    let dayShift = [];
    let nightShift = [];
    let overNight = [];
    let used = 0;
    this.production.forEach(pro=>{
      this.total += +pro.quantity;
      used += 1;
      if (pro.average){
        if (pro.shift == "Day"){
          dayShift.push(pro.quantity)
        } else if (pro.shift == "Night"){
          nightShift.push(pro.quantity)
        } else if (pro.shift == "Over-Night"){
          overNight.push(pro.quantity)
        }
      }
      if (used == this.production.length){
        if (dayShift.length > 0){
          this.dayAvg = +(dayShift.reduce((a,b)=>{
            return +a + +b;
          }, 0) / dayShift.length).toFixed(0);
        } else {
          this.dayAvg = 0;
        }
        if (nightShift.length > 0){
          this.nightAvg = +(nightShift.reduce((a,b)=>{
            return +a + +b;
          }, 0) / nightShift.length).toFixed(0);
        } else {
          this.nightAvg = 0;
        }
        if (overNight.length > 0){
          this.overNightAvg = +(overNight.reduce((a,b)=>{
            return +a + +b;
          }, 0) / overNight.length).toFixed(0);
        } else {
          this.overNightAvg = 0;
        }
      }
    })
  }

  changeDate(){
    let hold = this.newMonthForm.value.date.split("-")
    this.year = +hold[0];
    this.month = +hold[1] - 1;
    this.setDate();
  }

  onViewDate(arr){
    let path = "/"+arr.join("/");
    this.router.navigate([path])
  }

}
