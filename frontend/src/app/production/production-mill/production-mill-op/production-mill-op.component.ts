import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Operation } from 'src/app/job/job-ops/operation.model';

@Component({
  selector: 'app-production-mill-op',
  templateUrl: './production-mill-op.component.html',
  styleUrls: ['./production-mill-op.component.css']
})
export class ProductionMillOpComponent implements OnInit {
  @Output() hour = new EventEmitter<number>();
  @Output() minute = new EventEmitter<number>();
  @Output() remains = new EventEmitter<string>();
  @Input() op: Operation
  @Input() jobNumber: string;
  editMode = false;
  hours: number;
  minutes: number;
  minFormat = "Minutes"
  hourFormat = "Hours"

  constructor() { }

  ngOnInit() {
    this.hours = Math.floor((+this.op.remainingQuantity*+this.op.cycleTime)/3600)
    this.minutes = Math.floor((+this.op.remainingQuantity*+this.op.cycleTime)/60%60)
    this.hour.emit(this.hours);
    this.minute.emit(this.minutes);
    if (this.minutes == 1){
      this.minFormat = "Minute"
    } else {
      this.minFormat = "Minutes"
    }
    if (this.hours == 1){
      this.hourFormat = "Hour"
    } else {
      this.hourFormat = "Hours"
    }
  }

  emitRemains($event){
    this.remains.emit($event)
  }

  changeEdit(){
    this.editMode = !this.editMode;
  }

}
