import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { Production } from '../../production.model';
import { ProductionService } from '../../production.service';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { HourlyService } from 'src/app/hourly/hourly.service';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-production-calender',
  templateUrl: './production-calender.component.html',
  styleUrls: ['./production-calender.component.css']
})
export class ProductionCalenderComponent implements OnInit {
  @Input() machine: Machine;
  @Input() month: number;
  @ViewChild('newMonth') newMonthForm: NgForm;
  editJob = false;
  production: Production[];
  date = new Date();
  today = this.date.getDate();
  monthHold: string;
  lastMonthHold: string;
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
  lastMonthDays = []
  firstDayOfMonth = [];
  dayAvg: number;
  nightAvg: number;
  overNightAvg: number;
  machTotal: number
  total: number
  editMode = false;
  firstProDay: number;
  firstProMonth: number;
  displayMax: number;



  constructor(
    public auth: AuthService,
    private router: Router,
    public dayServ: DaysService,
    public proServ: ProductionService,
    private opServ: OpService,
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.editMode = false;
    let monthNum = this.month + 1;
    this.monthHold = "" + monthNum;
    let lastMonthNum = this.month;
    this.lastMonthHold = "" + lastMonthNum;
    if (this.month < 9){
      this.monthHold ="0"+this.monthHold;
    }
    if (this.month < 8){
      this.lastMonthHold ="0"+this.lastMonthHold;
    }
    this.defaultMonth = this.year + "-" + this.monthHold;
    this.getProduction();
    this.getTotal();
    this.proServ.proChanged.subscribe(()=>{
      this.editMode = false;
      this.getProduction();
      this.getTotal();
    })
    this.proServ.proChangedAvg.subscribe(()=>{
      this.editMode = false;
      this.getProduction();
    })
    this.machServ.machChanged.subscribe(()=>{
      this.editJob = false;
    })
  }

  getProduction(){
    let search = "mach=" + this.auth.splitJoin(this.machine.machine) 
      + "&job=" + this.machine.currentJob 
      + "&op=" + this.opServ.slashToDash(this.machine.currentOp);
    this.proServ.fetchProduction(search).subscribe(prod=>{
      this.production = prod;
      if (prod.length > 0){
        this.firstProDay = +(prod[0].date.substring(8,10))
        this.firstProMonth = +(prod[0].date.substring(5,7))
        this.setDate();
        this.setAverage();
      } else {
        this.firstProDay = this.today
        this.dayAvg = 0;
        this.nightAvg = 0;
        this.overNightAvg = 0;
      }
    })
  }

  getTotal(){
    this.total = 0;
    let search = "op=" + this.opServ.slashToDash(this.machine.currentOp)
      + "&job=" + this.machine.currentJob;
    this.proServ.fetchProduction(search).subscribe(prod=>{
      this.total = 0;
      prod.forEach((set)=>{
        this.total += +set.quantity;
      })
    })
  }

  editProd(){
    this.editMode = true;
  }

  submitAll(){
    this.proServ.proSubmit.next();
    setTimeout(()=>{this.proServ.proChanged.next();},200);
  }

  cancel(){
    this.editMode = false;
  }

  setDate(){
    this.daysInMonth(this.year, this.month+1);
    let firstDay = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = _.range(0, firstDay.getDay());
    this.displayMax = this.today+this.firstDayOfMonth.length
    if (this.displayMax%7 != 0){
      let totalDays = ((Math.floor(this.displayMax/7) + 1)*7)- this.firstDayOfMonth.length
      if (totalDays < this.numberOfDays){
        this.monthDays = _.range(1, totalDays + 1);
      } else {
        this.monthDays = _.range(1, this.numberOfDays + 1);
      }
    } else {
      this.monthDays = _.range(1, this.today+ 1);
    }
    if (this.firstProMonth == this.month + 1){
      this.lastMonthDays = [];
      if (this.firstDayOfMonth.length + this.firstProDay > 7){
        this.monthDays = this.monthDays.splice(7-this.firstDayOfMonth.length ,this.monthDays.length -1)
        this.removeUnusedWeeksBeginning(this.firstDayOfMonth.length, 14)
        this.firstDayOfMonth = [];
      }
    } else if (this.lastMonthDays.length > 0){
      this.firstDayOfMonth = [];
    }
  }

  removeUnusedWeeksBeginning(extra, start: number){
    if (this.firstDayOfMonth.length + this.firstProDay > start){
      this.monthDays = this.monthDays.splice(7 ,this.monthDays.length -1)
      this.removeUnusedWeeksBeginning(extra, start + 7)
    }
  }

  daysInMonth(year: number, month: number){
    this.numberOfDays = new Date(year, month, 0).getDate();
  }

  jobEdit(){
    this.editJob = true;
  }

  addOldWeek(){
    if (this.firstDayOfMonth.length > 0){
      this.firstDayOfMonth = [];
    }
    if (this.lastMonthDays.length == 0){
      let first = this.monthDays[0];
      if (first - 7 > 0){
        let range = _.range(first - 7, first);
        this.monthDays = range.concat(this.monthDays);
      } else {
        let firstDay = new Date(this.year, this.month, 1).getDay();
        this.daysInMonth(this.year, this.month);
        this.lastMonthDays = _.range(this.numberOfDays-firstDay, this.numberOfDays)
        let range = _.range(1, first);
        this.monthDays = range.concat(this.monthDays);
      }
    } else {
      let first = this.lastMonthDays[0];
      if (first - 7 > 0){
        let range = _.range(first - 7, first);
        this.lastMonthDays = range.concat(this.lastMonthDays);
      }
    }
  }

  setAverage(){
    this.machTotal = 0;
    let dayShift = [];
    let nightShift = [];
    let overNight = [];
    let used = 0;
    this.production.forEach(pro=>{
      this.machTotal += +pro.quantity;
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

  onViewDate(arr){
    let path = "/"+arr.join("/");
    this.router.navigate([path])
  }

}
