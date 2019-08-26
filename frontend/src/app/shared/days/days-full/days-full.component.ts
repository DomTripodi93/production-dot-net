import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Production } from 'src/app/production/production.model';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductionService } from 'src/app/production/production.service';
import { DaysService } from '../days.service';

@Component({
  selector: 'app-days-full',
  templateUrl: './days-full.component.html',
  styleUrls: ['./days-full.component.css']
})
export class DaysFullComponent implements OnInit {
  subscription: Subscription;
  searchHold = [];
  search = '';
  production: Production[] = [];
  isFetching = false;
  isError=false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private pro: ProductionService,
    private dayServ: DaysService
    ) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: Params) =>{
      this.dayServ.month = params['month'];
      this.dayServ.today = params['day'];
      this.dayServ.year = params['year'];
      this.searchHold.push(this.dayServ.year);
      this.dayServ.day = new Date(this.dayServ.year, +this.dayServ.month-1, +this.dayServ.today).getDay()
      this.dayServ.stringMonth = ""+this.dayServ.month;
      if (this.dayServ.month < 10 && this.dayServ.stringMonth.length <2){
        this.dayServ.stringMonth = "0" + this.dayServ.month;
      }
      this.searchHold.push(this.dayServ.stringMonth);
      if (+this.dayServ.today < 10 && this.dayServ.today.length <2){
        this.dayServ.today = "0" + this.dayServ.today;
      }
      this.searchHold.push(this.dayServ.today);
      this.search = this.searchHold.join("-");
      this.pro.fetchProduction("date="+this.search)
        .subscribe(production => {
          this.production = production;
          this.isFetching = false;
        }, error => {
          this.isFetching = false;
          this.isError = true;
          this.error = error.message
        })
    });
  }

}