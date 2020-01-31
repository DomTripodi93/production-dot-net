import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Job } from '../job.model';
import { JobService } from '../job.service';
import { AuthService } from 'src/app/shared/auth.service';
import { PartService } from 'src/app/part/part.service';
import { Part } from 'src/app/part/part.model';
import { OpService } from '../job-ops/operation.service';
import { DaysService } from 'src/app/shared/days/days.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {
  @Input() job: Job;
  editJobForm: FormGroup;
  canInput = false;
  isError = false;
  error = "";
  parts: Part[] = [];
  date = "";
  
  constructor(
    private jobServ: JobService,
    private auth: AuthService,
    private partServ: PartService,
    private opServ: OpService,
    private dayServ: DaysService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.setDate();
  }

  setDate(){
    this.date = this.dayServ.dateForForm(this.job.deliveryDate);
    this.getParts();
  }

  getParts(){
    this.partServ.fetchPartsByType().subscribe(parts => {
      this.parts = parts;
      this.initEditForm();
    });
  }


  private initEditForm() {
    let orderQuantity = this.job.orderQuantity;
    let weightRecieved = this.job.weightRecieved;
    let oal = this.job.oal;
    let cutOff = this.job.cutOff;
    let mainFacing = this.job.mainFacing;
    let subFacing = this.job.subFacing;

    this.editJobForm = new FormGroup({
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing),
      "machType": new FormControl(this.auth.machType),
      "deliveryDate": new FormControl(this.date)
    });
  }

  onSubmit(){
    this.editJob(this.editJobForm.value);
    if (this.auth.machType == "mill"){
      if (this.editJobForm.value.orderQuantity > 0){
        this.getOpForChange();
      }
    }
  }

  getOpForChange(){
    this.opServ.fetchOpByJob(this.job.jobNumber).subscribe(ops=>{
      ops.forEach(op=>{
        if (op.partsToDate){
          let rem = {remainingQuantity: this.editJobForm.value.orderQuantity - +op.partsToDate};
          this.updateOpRemaining(rem, op);
        } else {
          let rem = {remainingQuantity: this.editJobForm.value.orderQuantity};
          this.updateOpRemaining(rem, op);
        }
        this.opServ.opsChanged.next();
      })
    })
  }

  updateOpRemaining(rem, op){
    this.opServ.changeOpRemaining(rem, op.opNumber + "&job=" + op.jobNumber).subscribe();
  }

  editJob(data: Job) {
    this.isError = false;
    this.jobServ.editJob(data, this.job.jobNumber).subscribe(()=>{
      this.onCancel();
    },
    () =>{
      this.isError = true;
    });
    if (this.isError){
      this.error = "Please submit valad parameters for update";
    }
  }

  onCancel(){
    this.jobServ.jobChanged.next();
  }

}
