import { Component, OnInit, Input } from '@angular/core';
import { Job } from 'src/app/job/job.model';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-production-mill-mach',
  templateUrl: './production-mill-mach.component.html',
  styleUrls: ['./production-mill-mach.component.css']
})
export class ProductionMillMachComponent implements OnInit {
  @Input() machine: string;
  jobs: Job[] = [];

  constructor(
    private jobServ: JobService
  ) { }

  ngOnInit() {
    this.getJobs();
  }

  getJobs(){
    this.jobServ.fetchJobsByType().subscribe(jobs=>{
      this.jobs = jobs.result;
    })
  }

}
