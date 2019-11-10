import { Component } from '@angular/core';
import { DaysService } from './days.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.css']
})
export class DaysComponent{
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


  constructor(
    public dayServ: DaysService,
    public auth: AuthService
    ) { 
      this.auth.machType = "lathe";
    }

}
