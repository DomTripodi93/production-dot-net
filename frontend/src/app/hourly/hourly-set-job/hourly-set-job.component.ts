import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HourlyService } from '../hourly.service';
import { MachineService } from '../../machine/machine.service';
import { JobService } from 'src/app/job/job.service';
import { OpService } from '../../job/job-ops/operation.service';
import { JobInfo } from 'src/app/machine/jobInfo.interface';
import { Machine } from 'src/app/machine/machine.model';

@Component({
  selector: 'app-hourly-set-job',
  templateUrl: './hourly-set-job.component.html',
  styleUrls: ['./hourly-set-job.component.css']
})
export class HourlySetJobComponent implements OnInit {
  @Input() index: number;
  setJobForm: FormGroup;
  thisJob: JobInfo;
  jobs = []
  setOps = ["None"];
  ops = ["None"];
  thisMach: Machine;

  constructor(
    private hourServ: HourlyService,
    private jobServ: JobService,
    private machServ: MachineService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.thisMach = this.hourServ.machine;
    this.jobServ.fetchAllJobs().subscribe(response =>{
      let goneThrough = 1;
      if (response.length==0){
        this.initForm();
      } else {
        response.forEach(job => {
          this.jobs.push(job.jobNumber);
          goneThrough++;
          if (goneThrough == response.length+1){
            this.changeOps("None");
            this.initForm();
          }
        });
      }
    });
  }

  private initForm(){

    this.setJobForm = new FormGroup({
      'jobNumber': new FormControl(this.thisJob, Validators.required),
      'opNumber': new FormControl(this.setOps[0], Validators.required)
    });
  }

  onSetJob(){
    this.setJobForm.value.jobNumber = this.setJobForm.value.jobNumber.jobNumber;
    this.machServ.setCurrentJob(this.setJobForm.value, this.thisMach.machine).subscribe(()=>{
      this.hourServ.hourlyChanged.next()
    });
    this.onCancel()
  }

  changeOps(option: String){
    this.ops = ["None"]
    if (option != "None"){
      this.opServ.fetchOpByJob(option).subscribe((ops)=>{
        ops.forEach((op)=>{
          this.ops.push(op.opNumber);
        })
      })
    }
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
  }


}
