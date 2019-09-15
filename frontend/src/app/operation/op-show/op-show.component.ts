import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Operation } from '../operation.model';
import { OpService } from '../operation.service';

@Component({
  selector: 'app-op-show',
  templateUrl: './op-show.component.html',
  styleUrls: ['./op-show.component.css']
})
export class OpShowComponent implements OnInit {
  operations: Operation[] = [];
  subscriptions: Subscription[] =[];
  isFetching = false;
  isError = false;
  error = '';

  constructor(
    private operationServ: OpService,
  ) { }

  ngOnInit() {
    this.getOps();
    this.subscriptions.push(this.operationServ.operationChanged.subscribe(()=>{
      setTimeout(()=>{this.getOps()}, 50);
    }));
  }

  getOps(){
    this.subscriptions.push(this.operationServ.fetchAllOps()
    .subscribe(operations => {
      this.operations = operations;
      this.isFetching = false;
    }, error => {
      this.isFetching = false;
      this.isError = true;
      this.error = error.message
    }));
  }


  onDelete(operation, id){
    if (confirm("Are you sure you want to delete " +operation+ "?")){
      this.operationServ.deleteOp(id).subscribe(()=>{
        this.operationServ.operationChanged.next();
      });
    }
  }

  ngOnDestroy(){
    this.operations = [];
    this.subscriptions.forEach((sub)=>{
      sub.unsubscribe();
    })
  }
}
