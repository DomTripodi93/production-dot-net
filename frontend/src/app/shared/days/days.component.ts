import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute,
    private dayServ: DaysService,
    private auth: AuthService
    ) { }


}
