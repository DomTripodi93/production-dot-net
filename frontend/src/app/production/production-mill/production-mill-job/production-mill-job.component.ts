import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { MillSet } from '../mill-set.model';
import { Job } from 'src/app/job/job.model';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-production-mill-job',
  templateUrl: './production-mill-job.component.html',
  styleUrls: ['./production-mill-job.component.css']
})
export class ProductionMillJobComponent implements OnInit {
  @Input() machine: string;
  @Input() job: Job;
  ops: Operation[] = [];
  hours = 0;
  minutes = 0;
  minFormat = "Minutes"
  hourFormat = "Hours"

  constructor(
    private opServ: OpService,
    private auth: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.opServ.opsChanged.subscribe(()=>{
      this.hours = 0;
      this.minutes = 0;
      this.getOps();
    })
    this.getOps();
  }

  getOps(){
    this.opServ.fetchOpByMachAndJob(this.auth.splitJoin(this.machine)+"&job="+this.job.jobNumber)
    .subscribe(ops=>{
      this.ops = ops;
    })
  }

  hourAdder($event){
    this.hours += $event;
    if (this.hours == 1){
      this.hourFormat = "Hour"
    } else {
      this.hourFormat = "Hours"
    }
    this.cdRef.detectChanges();
  }

  minuteAdder($event){
    this.minutes += $event;
    if (this.minutes > 60){
      this.minutes -= 60;
      this.hours += 1;
    }
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
    this.cdRef.detectChanges();
  }

  catchRemains($event){
    this.job.remainingQuantity = $event;
  }

}
