import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { OpService } from '../operation.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-job-ops-show',
  templateUrl: './job-ops-show.component.html',
  styleUrls: ['./job-ops-show.component.css']
})
export class JobOpsShowComponent implements OnInit, OnDestroy {
  @Input() operation: string;
  opSubscription: Subscription;
  operations: Operation[] = [];
  id = '';
  showForm = false;
  editOp: boolean[] = [];

  constructor(
    private opServ: OpService,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.getOps();
    this.opSubscription = this.opServ.opsChanged.subscribe(()=>{
        this.getOps();
        this.showForm = false;
        for (let bool in this.editOp){
          this.editOp[bool] = false; 
        }
      }
    )
  }

  onDelete(operation: Operation){
    if (confirm(
      "Are you sure you want to delete " + operation.opNumber + " for job # " 
      + operation.jobNumber + "?"
      )){
        if (operation.opNumber.includes("/")){
          operation.opNumber = this.opServ.slashToDash(operation.opNumber);
        }
        let searchForDelete = operation.opNumber + "&job=" + operation.jobNumber;
        this.opServ.deleteOp(searchForDelete).subscribe(()=>{
        setTimeout(()=>{this.getOps()},)}
      );
      this.opServ.opsChanged.next();
    }
  }

  getOps() {
      this.opServ.fetchOpByJob(this.operation)
        .subscribe(ops => {
          ops.forEach(op => {
            this.editOp.push(false)
            if (+op.remainingQuantity < 1){
              op.remainingQuantity = "0";
            }
          });
          this.operations = ops;
          this.dayServ.dates = [];
        });
  }

  opEdit(index: number){
    this.editOp[index] = true
  }

  newOp(){
    this.showForm = true;
  }

  ngOnDestroy(){
    this.opSubscription.unsubscribe();
  }
  //Removes observable subscription

}
