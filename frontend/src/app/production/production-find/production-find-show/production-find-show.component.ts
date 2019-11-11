import { Component, OnInit, Input } from '@angular/core';
import { Production } from '../../production.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { ProductionService } from '../../production.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';
import { OpService } from 'src/app/job/job-ops/operation.service';

@Component({
  selector: 'app-production-find-show',
  templateUrl: './production-find-show.component.html',
  styleUrls: ['./production-find-show.component.css']
})
export class ProductionFindShowComponent implements OnInit {
  @Input() singleProd: Production;
  isFetching = false;
  isError = false;
  error: string = '';
  production: Production[] = [];
  id: string = '';
  search: string[];
  subscriptions: Subscription[] = []
  total: number;
  quantity: Production;
  editMode: boolean = false;
  editMulti: boolean[] = [];
  inQuestion = {
    inQuestion: true
  }
  date = "";

  constructor(
    private pro: ProductionService,
    private route: ActivatedRoute,
    public dayServ: DaysService,
    public auth: AuthService,
    public opServ: OpService
  ) { }

  ngOnInit() {
    this.dayServ.dates = [];
    if (!this.singleProd){
      this.subscriptions.push(
        this.route.params.subscribe((params: Params) => {
          this.search = params["search"];
          this.getJobProduction();
        })
      )
    } else {
      this.setSingleProduction();
    }
    this.subscriptions.push(
      this.pro.proChanged.subscribe(()=>{
        if (!this.singleProd){
          this.editMulti = [];
          this.production = [];
          this.getJobProduction();
        } else {
          this.setSingleProduction();
          this.editMode = false;
        }
      })
    )
  }

  getJobProduction() {
    this.isFetching = true;
    this.pro.fetchProduction(this.search)
      .subscribe(production => {
        this.production = production;
        this.dayServ.dates = [];
        this.total = 0;
        this.production.forEach(lot => {
          this.editMulti.push(false);
          let beginning = lot.date.substring(5,10);
          lot.date = beginning + "-" + lot.date.substring(0,4);
          this.total = +lot.quantity + this.total;
          this.dayServ.dates.push(this.dayServ.dashToSlash(lot.date));
        })
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message;
      })
  }  

  setSingleProduction() {
    let beginning = this.singleProd.date.substring(5,10);
    this.singleProd.date = beginning + "-" + this.singleProd.date.substring(0,4);
    this.total = +this.singleProd.quantity + this.total;
    this.date = this.dayServ.dashToSlash(this.singleProd.date);
  }  

  onEdit(){
    this.editMode = true;
  }

  onEditMulti(set){
    this.editMulti[set] = true;
  }

  lotInQuestion(id){
    this.inQuestion.inQuestion = true;
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next();
    })
  }

  lotIsGood(id){
    this.inQuestion.inQuestion = false;
    this.pro.setInQuestion(this.inQuestion, id).subscribe(()=>{
      this.pro.proChanged.next();
    })
  }

}
