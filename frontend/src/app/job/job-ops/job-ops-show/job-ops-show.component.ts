import { Component, OnInit, Input } from '@angular/core';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { OpService } from '../operation.service';
import { DaysService } from 'src/app/shared/days/days.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-job-ops-show',
  templateUrl: './job-ops-show.component.html',
  styleUrls: ['./job-ops-show.component.css']
})
export class JobOpsShowComponent implements OnInit {
  @Input() operation: string;
  isFetching = false;
  isError = false;
  error = '';
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
    this.opServ.opsChanged.subscribe(()=>{
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
        let searchForDelete = operation.opNumber + "&job=" + operation.jobNumber;
        this.opServ.deleteOp(searchForDelete).subscribe(()=>{
        setTimeout(()=>{this.getOps()},)}
      );
      this.opServ.opsChanged.next();
    }
  }

  getOps() {
    this.isFetching = true;
      this.opServ.fetchOpByJob(this.operation)
        .subscribe(operation => {
          for (let i in operation){
            this.editOp.push(false)
          }
          this.operations = operation;
          this.dayServ.dates = [];
          this.isFetching = false;
        }, error => {
          this.isFetching = false;
          this.isError = true;
          this.error = error.message
        })
  }

  opEdit(index: number){
    this.editOp[index] = true
  }

  newOp(){
    this.showForm = true;
  }


}
