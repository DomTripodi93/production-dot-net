import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../production.service';
import { Subscription } from 'rxjs';
import { DaysService } from '../../shared/days/days.service';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.css']
})
export class ProductionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  isFetching = false;
  isError = false;
  error = '';
  ids = [];

  constructor(
    private pro: ProductionService,
    private dayServ: DaysService
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
    this.subscriptions.push(this.pro.fetchAllProduction()
    .subscribe(production => {
      production.forEach((lot) =>{
        this.ids.push(lot.id);
      });
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message;
    }));
  }

}
