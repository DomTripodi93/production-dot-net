import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../production.service';
import { Subscription } from 'rxjs';
import { DaysService } from '../../shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Production } from '../production.model';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.css']
})
export class ProductionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  productionLots: Production [];
  isFetching = false;
  isError = false;
  error = '';

  constructor(
    private pro: ProductionService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.getProduction();
    this.subscriptions.push(this.pro.proChanged.subscribe(()=>{
      setTimeout(()=>{
        this.getProduction();
      },50)}
    ))

  }

  getProduction(){
    this.subscriptions.push(
      this.pro.fetchProductionByType()
      .subscribe(production => {
        this.productionLots = production
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message;
      })
    );
  }

}
