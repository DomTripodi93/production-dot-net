import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HourlyService } from '../hourly.service';
import { MachineService } from '../../machine/machine.service';
import { JobService } from 'src/app/job/job.service';

@Component({
  selector: 'app-hourly-set-job',
  templateUrl: './hourly-set-job.component.html',
  styleUrls: ['./hourly-set-job.component.css']
})
export class HourlySetJobComponent implements OnInit {
  @Input() index: number;
  setJobForm: FormGroup;
  jobs = [];

  constructor(
    private hourServ: HourlyService,
    private jobServ: JobService,
    private machServ: MachineService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  private initForm(){
    this.jobs = ["None"];
    this.jobServ.fetchAllJobs().subscribe(response =>{
      response.forEach(job => {
        this.jobs.push(job.job)
      });
    })

    this.setJobForm = new FormGroup({
      "currentJob": new FormControl(this.jobs[0], Validators.required)
    });
  }

  onSetJob(){
    this.machServ.setCurrentJob(this.setJobForm.value, this.hourServ.machine.id).subscribe(()=>{
      this.hourServ.hourlyChanged.next()
    });
    this.onCancel()
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
  }


}
