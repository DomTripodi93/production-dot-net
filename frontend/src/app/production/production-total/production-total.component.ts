import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-production-total',
  templateUrl: './production-total.component.html',
  styleUrls: ['./production-total.component.css']
})
export class ProductionTotalComponent implements OnInit {
  @Input() partsToDate: string;
  @Input() jobNumber: string;
  @Input() opNumber: string;
  editTotalForm: FormGroup;
  difference: number;
  
  constructor(
    private opServ: OpService,
    private jobServ: JobService
  ) { }

  ngOnInit() {
    this.opServ.partsToDateSubmit.subscribe(()=>{
      this.onSubmit();
    })
    this.initForm();
  }


  private initForm() {
    this.editTotalForm = new FormGroup({
      'partsToDate': new FormControl(this.partsToDate)
    });
  }

  onSubmit(){
    if (this.opNumber.includes("/")){
      this.opNumber = this.opServ.slashToDash(this.opNumber);
    }
    if (+this.partsToDate != this.editTotalForm.value.partsToDate){
      this.difference = this.editTotalForm.value.partsToDate - +this.partsToDate;
      this.partsToDate = "" +this.editTotalForm.value.partsToDate;
      this.opServ.changeOpPartsToDate(
        this.editTotalForm.value, 
        this.opNumber + "&job=" + this.jobNumber
        ).subscribe()
      this.opServ.fetchOp(this.opNumber + "&job=" + this.jobNumber).subscribe(op=>{
        let rem = {remainingQuantity: +op.remainingQuantity - this.difference};
        this.opServ.changeOpRemaining(
          rem, 
          this.opNumber + "&job=" + this.jobNumber
          ).subscribe(()=>{
            this.opServ.fetchOpByJob(this.jobNumber).subscribe(ops=>{
              let remains = +ops[0].remainingQuantity;
              let used = 0;
              ops.forEach(op=>{
                used ++
                if (remains < +op.remainingQuantity){
                  remains = +op.remainingQuantity;
                }
                if (used == ops.length){
                  let remainingData = {
                    remainingQuantity: remains
                  }
                  this.jobServ.changeJobRemaining(remainingData, op.jobNumber).subscribe();
                  this.jobServ.jobChanged.next()
                }
              })
            })
          })
      })
    }
  }

  submitAll(){
    this.opServ.partsToDateSubmit.next();
    setTimeout(()=>{this.opServ.opsChanged.next()}, 50);
  }

  onCancel(){
    this.opServ.opsChanged.next();
  }

}
