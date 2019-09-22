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
  jobs: JobInfo[] = [{id: 0, jobNumber: "None"}];
  setOps = ["None"];
  opSet: string[][] = [["None"]];
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
          let info: JobInfo = {
            id: goneThrough,
            jobNumber: job.jobNumber
          }
          this.jobs.push(info);
          if (this.thisMach.currentJob == info.jobNumber){
            this.thisJob = info;
          }
          goneThrough++;
          if (goneThrough == response.length + 1){
            let jobsUsed = 0;
            for (let job in this.jobs){
              if (job != "0"){
                this.opServ.fetchOpByJob("job=" + this.jobs[job].jobNumber).subscribe((op)=>{
                  let opHold = ["None"]
                  op.forEach((set)=>{
                    opHold.push(set.opNumber);
                  })
                  this.opSet.push(opHold);
                  if (jobsUsed == this.jobs.length){
                    this.initForm();
                  }
                }, ()=>{
                  this.opSet.push(this.setOps);
                  this.initForm();
                });
              }
              jobsUsed++;
            }
          }
        });
      }
    });
  }

  private initForm(){
    this.changeOps(""+this.thisJob.id);

    this.setJobForm = new FormGroup({
      'currentJob': new FormControl(this.thisJob, Validators.required),
      'currentOp': new FormControl(this.setOps[0], Validators.required)
    });
  }

  onSetJob(){
    this.setJobForm.value.currentJob = this.setJobForm.value.currentJob.jobNumber;
    this.machServ.setCurrentJob(this.setJobForm.value, this.thisMach.machine).subscribe(()=>{
      this.hourServ.hourlyChanged.next()
    });
    this.onCancel()
  }

  changeOps(option: String){
    let val: String = "" +option
    if (this.opSet){
      this.setOps = this.opSet[+val.substring(0,1)];
    }
  }

  onCancel(){
    this.hourServ.quick[this.index]=false;
  }


}
