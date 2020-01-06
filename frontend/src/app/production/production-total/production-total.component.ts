import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-production-total',
  templateUrl: './production-total.component.html',
  styleUrls: ['./production-total.component.css']
})
export class ProductionTotalComponent implements OnInit {
  @Output() remainingQ= new EventEmitter<string>();
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
        let search = this.opNumber + "&job=" + this.jobNumber;
        this.opServ.changeOpRemaining(rem, search).subscribe(()=>{
          this.opServ.fetchOpByJob(this.jobNumber).subscribe(ops=>{
            let remains = +ops[0].remainingQuantity;
            let used = 0;
            ops.forEach(op=>{
              used ++
              if (remains < +op.remainingQuantity){
                remains = +op.remainingQuantity;
              }
              if (used == ops.length){
                if (remains < 1){
                  remains = 0;
                }
                let remainingData = {
                  remainingQuantity: remains
                }
                this.jobServ.changeJobRemaining(remainingData, op.jobNumber).subscribe(()=>{
                  this.remainingQ.emit(""+remains);
                  this.opServ.opsChanged.next();
                });
              }
            })
          })
        })
      })
    } else {
      this.opServ.opsChanged.next();
    }
  }

  submitAll(){
    this.opServ.partsToDateSubmit.next();
  }

  onCancel(){
    this.opServ.opsChanged.next();
  }

}
