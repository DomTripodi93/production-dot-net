import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { MachineService } from 'src/app/machine/machine.service';
import { JobService } from 'src/app/job/job.service';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobInfo } from '../jobInfo.interface';

@Component({
  selector: 'app-machine-new',
  templateUrl: './machine-new.component.html',
  styleUrls: ['./machine-new.component.css']
})
export class MachineNewComponent implements OnInit {
  error = '';
  canInput= false;
  machineForm: FormGroup;
  isError = false;
  jobs: JobInfo[] = [{id: 0, jobNumber: "None"}];
  ops = ["None"];
  opSet: string[][] = [["None"]];

  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private opServ: OpService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.jobServ.fetchAllJobs().subscribe(response =>{
      let goneThrough = 1;
      if (response.length==0){
        this.initForm();
      } else {
        response.forEach(job => {
          this.jobs.push({
            id: goneThrough,
            jobNumber: job.jobNumber
          });
          goneThrough++;
          if (goneThrough == response.length+1){
            let jobsUsed = 0;
            for (let job in this.jobs){
              if (job != "0"){
                this.opServ.fetchOpByJob("job=" + this.jobs[job].jobNumber).subscribe((op)=>{
                  op.forEach((set)=>{
                    this.ops.push(set.opNumber);
                  })
                  this.opSet.push(this.ops);
                  this.ops = ["None"];
                  if (jobsUsed == this.jobs.length){
                    this.initForm();
                  }
                }, ()=>{
                  this.opSet.push(this.ops);
                  this.initForm();
                });
              }
              jobsUsed++;
            }
          }
        });
      }
    });
    this.auth.hideButton(0);
  }
    
  private initForm() {
    let machine = '';
    // use an index ^^
    this.machineForm = new FormGroup({
      'machine': new FormControl(machine, Validators.required),
      'currentJob': new FormControl(this.jobs[0]),
      'currentOp': new FormControl(this.ops[0])
    });
  }
  
  onSubmit(){
    this.machineForm.value.currentJob = this.machineForm.value.currentJob.jobNumber;
    this.newMachine(this.machineForm.value);
  }

  changeOps(option: String){
    let val: String = "" +option
    if (this.opSet){
      this.ops = this.opSet[+val.substring(0,1)];
    }
  }

  newMachine(data: Machine) {
    this.mach.addMachine(data).subscribe(()=>{
      this.mach.machChanged.next();
    }, () =>
      this.error = "This machine already exists"
    );
    if (this.error){
      this.isError = true;
    }else{
      setTimeout(()=>{
      this.router.navigate([".."], {relativeTo: this.route})},50);
    }
    

  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
