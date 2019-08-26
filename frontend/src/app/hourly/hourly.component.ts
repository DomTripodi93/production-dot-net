import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { DaysService } from '../shared/days/days.service';

@Component({
  selector: 'app-hourly',
  templateUrl: './hourly.component.html',
  styleUrls: ['./hourly.component.css']
})
export class HourlyComponent implements OnInit {

  constructor(    
    private router: Router,
    private dayServe: DaysService,
    private auth: AuthService
  ){}

  onNew(){
    this.router.navigate(["/hourly/new"])
  }

  ngOnInit() {
    this.dayServe.resetDate();
  }

}
