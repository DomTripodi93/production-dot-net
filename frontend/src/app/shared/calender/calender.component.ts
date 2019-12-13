import { Component, OnInit, ViewChild } from '@angular/core';
import _ from 'lodash';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from '../days/days.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  @ViewChild('newMonth', {static:false}) newMonthForm: NgForm;
  date = new Date();
  today = this.date.getDate();
  month = this.date.getMonth();
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
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  numberOfDays: number;
  monthDays = []
  firstDayOfMonth = []
  firstDay: Date;
  welcome = '';
  set = "";



  constructor(
    public auth: AuthService,
    private router: Router,
    public dayServ: DaysService
  ) { }


  daysInMonth(year: number, month: number){
    this.numberOfDays = new Date(year, month, 0).getDate();
  }

  ngOnInit() {
    if (this.month < 9){
      this.monthHold ="0"+this.monthHold
    }
    this.defaultMonth = this.year + "-" + this.monthHold
    this.setDate()
  }


  setDate(){
    this.daysInMonth(this.year, this.month+1);
    this.monthDays = _.range(1, this.numberOfDays + 1);
    this.firstDay = new Date(this.year, this.month, 1);
    this.firstDayOfMonth = _.range(0, this.firstDay.getDay());
    this.welcome = "Today is " + this.days[this.day] + " " + (this.month+1) + "-" + this.today + "-" + this.year;

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
