import { Component, OnInit } from '@angular/core';
import { Operation } from '../../operation.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { OpService } from '../../operation.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DaysService } from 'src/app/shared/days/days.service';

@Component({
  selector: 'app-op-find-show',
  templateUrl: './op-find-show.component.html',
  styleUrls: ['./op-find-show.component.css']
})
export class OpFindShowComponent implements OnInit {
  isFetching = false;
  isError = false;
  error = '';
  operations: Operation[] = [];
  operation = "";
  id = '';
  subscription = new Subscription;
  subscription2 = new Subscription;

  constructor(
    private auth: AuthService,
    private operationServ: OpService,
    private route: ActivatedRoute,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.subscription2 = this.route.params.subscribe((params: Params) =>{
      this.operation = params['operation'];
      this.getOneOp();
    });
    this.subscription = this.auth.authChanged.subscribe(
      ()=>{
        this.id = this.auth.user
      }
    )
  }

  onDelete(operation, id){
    if (confirm("Are you sure you want to delete " +operation+ "?")){
      this.operationServ.deleteOp(id).subscribe(()=>{
      setTimeout(()=>{this.getOneOp()},)}
      );
      this.operationServ.operationChanged.next();
    }
  }

  getOneOp() {
    this.isFetching = true;
    this.operationServ.fetchOp(this.operation)
      .subscribe(operation => {
        this.operations = operation;
        this.dayServ.dates = [];
        this.isFetching = false;
      }, error => {
        this.isFetching = false;
        this.isError = true;
        this.error = error.message
      })
  }  

}
