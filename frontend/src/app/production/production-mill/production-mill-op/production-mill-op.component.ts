import { Component, OnInit, Input } from '@angular/core';
import { Operation } from 'src/app/job/job-ops/operation.model';

@Component({
  selector: 'app-production-mill-op',
  templateUrl: './production-mill-op.component.html',
  styleUrls: ['./production-mill-op.component.css']
})
export class ProductionMillOpComponent implements OnInit {
  @Input() op: Operation
  @Input() jobNumber: string;
  editMode = false;
  hours: number;
  minutes: number;

  constructor() { }

  ngOnInit() {
    this.hours = Math.floor((+this.op.remainingQuantity*+this.op.cycleTime)/3600)
    this.minutes = Math.floor((+this.op.remainingQuantity*+this.op.cycleTime)/60%60)
  }

  changeEdit(){
    this.editMode = !this.editMode;
  }

}
