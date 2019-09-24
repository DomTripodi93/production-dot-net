import { Component, OnInit } from '@angular/core';
import { Production } from '../production.model';
import { ProductionService } from '../production.service';
import { Subscription } from 'rxjs';
import { DaysService } from '../../shared/days/days.service';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.css']
})
export class ProductionListComponent implements OnInit {
  productionLots: Production[] = [];
  subscriptions: Subscription[]=[];
  isFetching = false;
  isError = false;
  error = '';
  inQuestion = {
    inQuestion: "True"
  }

  constructor(
    private pro: ProductionService,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.getProduction();
    this.subscriptions.push(this.pro.proChanged.subscribe(()=>{
      setTimeout(()=>{this.getProduction()},50)}
    ))

  }

  getProduction(){
    this.subscriptions.push(this.pro.fetchAllProduction()
    .subscribe(production => {
      this.productionLots = production;
      this.productionLots.forEach((lot) =>{
        let beginning = lot.date.substring(6,10);
        lot.date = beginning + "-" + lot.date.substring(0,4);
      });
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  lotInQuestion(id){
    this.inQuestion.inQuestion = "True"
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next()
    })
  }

  lotIsGood(id){
    this.inQuestion.inQuestion = "False"
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next()
    })
  }

}
