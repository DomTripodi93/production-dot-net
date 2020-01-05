import { Component, OnInit, Input } from '@angular/core';
import { Machine } from '../../../machine/machine.model';
import { Job } from '../../../job/job.model';
import { JobService } from '../../../job/job.service';
import { OpService } from '../../../job/job-ops/operation.service';

@Component({
  selector: 'app-home-line',
  templateUrl: './home-line.component.html',
  styleUrls: ['./home-line.component.css']
})
export class HomeLineComponent implements OnInit {
  @Input() mach: Machine;
  @Input() job: Job;
  jobInUse: Job;



  constructor(
    private jobServ: JobService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    if (this.mach){
      this.getJobFromMach();
    } else {
      this.jobInUse = this.job;
    }
  }

  getJobFromMach(){
    this.jobServ.fetchJob(this.mach.currentJob).subscribe(
      job =>{
        this.jobInUse = job
      }
    );
  }

}
