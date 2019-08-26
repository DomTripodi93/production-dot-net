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
    in_question: "True"
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
      this.dayServ.dates = [];
      this.productionLots.forEach((lot) =>{
        this.dayServ.dates.push(this.dayServ.dashToSlash(lot.date))
      })
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }

  lotInQuestion(id){
    this.inQuestion.in_question = "True"
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next()
    })
  }

  lotIsGood(id){
    this.inQuestion.in_question = "False"
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next()
    })
  }

}
