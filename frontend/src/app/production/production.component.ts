import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DaysService } from '../shared/days/days.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent {

  constructor(
    private router: Router,
    private dayServe: DaysService,
    private auth: AuthService
  ){}

  onNew(){
    this.dayServe.resetDate();
    this.router.navigate(["/production/new"])
  }

}
