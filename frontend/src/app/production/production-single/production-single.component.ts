import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductionService } from '../production.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Production } from '../production.model';
import { Subscription } from 'rxjs';
import { DaysService } from '../../shared/days/days.service';

@Component({
  selector: 'app-production-single',
  templateUrl: './production-single.component.html',
  styleUrls: ['./production-single.component.css']
})
export class ProductionSingleComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  production: Production;
  id = '';
  job = '';
  subscription = new Subscription;
  subscription2 = new Subscription;

  constructor(
    private auth: AuthService,
    private pro: ProductionService,
    private route: ActivatedRoute,
    private router: Router,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) =>{
      this.id = params['id'];
      this.getSingleProduction();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  } 

  getSingleProduction() {
    this.isFetching = true;
    this.pro.fetchProductionById(this.id)
      .subscribe(production => {
        this.dayServ.dates = [];
        this.production = production;
        this.dayServ.dates.push(this.dayServ.dashToSlash(production.date))
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
