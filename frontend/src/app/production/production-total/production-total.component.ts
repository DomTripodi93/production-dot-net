import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OpService } from 'src/app/job/job-ops/operation.service';

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
  
  constructor(
    private opServ: OpService
  ) { }

  ngOnInit() {
    console.log(this.opNumber + "&job=" + this.jobNumber)
    this.initForm();
  }


  private initForm() {
    this.editTotalForm = new FormGroup({
      'partsToDate': new FormControl(this.partsToDate)
    });
  }

  onSubmit(){
    this.opServ.changeOpPartsToDate(this.editTotalForm.value, this.opNumber + "&job=" + this.jobNumber)
    .subscribe(()=>{
      this.opServ.opsChanged.next();
    })
  }

  onCancel(){
    this.opServ.opsChanged.next();
  }

}
