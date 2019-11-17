import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { Production } from '../../production.model';
import { ProductionDate } from '../../productionDate.model';
import { ProductionService } from '../../production.service';

@Component({
  selector: 'app-production-calender',
  templateUrl: './production-calender.component.html',
  styleUrls: ['./production-calender.component.css']
})
export class ProductionCalenderComponent implements OnInit {
  @Input() production: Production[];
  @Input() machine: string;
  @Input() month: number;
  @ViewChild('newMonth') newMonthForm: NgForm;
  date = new Date();
  today = this.date.getDate();
  monthHold = ""+(this.month+1);
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
  firstDayOfMonth = []
  firstDay: Date;
  proDates: ProductionDate[] = [];
  dayShift = [];
  nightShift = [];
  overNight = [];
  dayAvg: number;
  nightAvg: number;
  overNightAvg: number;
  total: number



  constructor(
    public auth: AuthService,
    private router: Router,
    public dayServ: DaysService,
    private proServ: ProductionService
  ) { }

  ngOnInit() {
    if (this.month < 9){
      this.monthHold ="0"+this.monthHold;
    }
    this.defaultMonth = this.year + "-" + this.monthHold;
    this.setDate();
  }

  daysInMonth(year: number, month: number){
    this.numberOfDays = new Date(year, month, 0).getDate();
  }

  setDate(){
    this.proDates = [];
    this.daysInMonth(this.year, this.month+1);
    this.monthDays = _.range(1, this.numberOfDays + 1);
    for (let day in this.monthDays){
      let proDate: ProductionDate = {
        date: +day + 1,
        production: []
      }
      this.proDates.push(proDate)
      if (+day == this.monthDays.length-1){
        this.total = 0;
        let used = 0;
        this.production.forEach(pro=>{
          this.total += +pro.quantity;
          used += 1;
          if (pro.average){
            if (pro.shift == "Day"){
              this.dayShift.push(pro.quantity)
            } else if (pro.shift == "Night"){
              this.nightShift.push(pro.quantity)
            } else if (pro.shift == "Over-Night"){
              this.overNight.push(pro.quantity)
            }
          }
          if (+pro.date.substring(5,7) == this.month + 1){
            this.proDates[+pro.date.substring(8,10) -1].production.push(pro);
          }
          if (used == this.production.length){
            if (this.dayShift.length > 0){
              this.dayAvg = +(this.dayShift.reduce((a,b)=>{
                return +a + +b;
              }, 0) / this.dayShift.length).toFixed(0);
            } else {
              this.dayAvg = 0;
            }
            if (this.nightShift.length > 0){
              this.nightAvg = +(this.nightShift.reduce((a,b)=>{
                return +a + +b;
              }, 0) / this.nightShift.length).toFixed(0);
            } else {
              this.nightAvg = 0;
            }
            if (this.overNight.length > 0){
              this.overNightAvg = +(this.overNight.reduce((a,b)=>{
                return +a + +b;
              }, 0) / this.overNight.length).toFixed(0);
            } else {
              this.overNightAvg = 0;
            }
          }
        })
      }
    }
    this.firstDay = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = _.range(0, this.firstDay.getDay());
  }

  changeAvg(avg: boolean, id){
    let newAvg = {
      average: !avg
    };
    this.proServ.setAverage(newAvg, id).subscribe(()=>{
      this.proServ.proChanged.next();
    });
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
