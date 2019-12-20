import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/job/job.service';
import { MachineService } from 'src/app/machine/machine.service';
import { Machine } from 'src/app/machine/machine.model';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lathes: Machine[] = [];
  mills: Machine[] = [];
  currentLatheJobs: Job[] = [];
  unusedLatheJobs: Job[] = [];
  millJobs: Job[] = [];

  constructor(
    private jobServ: JobService,
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.machServ.fetchMachinesByType("Lathe").subscribe(machines => {
      console.log(machines);
      this.lathes = machines;
    })
    this.machServ.fetchMachinesByType("Mill").subscribe(machines => {
      console.log(machines);
      this.mills = machines;
    })
    this.jobServ.fetchJobsByType(1, 20, "Lathe").subscribe(jobs => {
      console.log(jobs);
      jobs.result.forEach(job=>{
        if (!this.currentLatheJobs.includes(job)){
          this.unusedLatheJobs.push(job);
        }
      })
    })
  }

}
