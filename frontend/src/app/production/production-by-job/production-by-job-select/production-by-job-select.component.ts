import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Production } from '../../production.model';
import { Subscription } from 'rxjs';
import { ProductionService } from '../../production.service';
import { AuthService } from 'src/app/shared/auth.service';
import { DaysService } from '../../../shared/days/days.service';

@Component({
  selector: 'app-production-by-job-select',
  templateUrl: './production-by-job-select.component.html',
  styleUrls: ['./production-by-job-select.component.css']
})
export class ProductionByJobSelectComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  production: Production[] = [];
  id = '';
  job = '';
  subscription = new Subscription;
  subscription2 = new Subscription;
  total: number = 0;
  quantity: Production;

  constructor(
    private auth: AuthService,
    private pro: ProductionService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscription2 = this.route.params.subscribe((params: Params) =>{
      this.job = params['job'];
      this.getJobProduction();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  }

  getJobProduction() {
    this.isFetching = true;
    this.pro.fetchProduction("job="+this.job)
      .subscribe(production => {
        this.production = production;
        this.dayServ.dates = [];
        this.production.forEach(pro => {
          this.total = +pro.quantity + this.total
          this.dayServ.dates.push(this.dayServ.dashToSlash(pro.date))
          // used in link to day's production
        })
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
