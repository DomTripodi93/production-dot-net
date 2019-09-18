import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { JobService } from 'src/app/job/job.service';
import { OpService } from 'src/app/operation/operation.service';
import { JobInfo } from '../jobInfo.interface';

@Component({
  selector: 'app-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.css']
})
export class MachineEditComponent implements OnInit {
  editMachineForm: FormGroup;
  machine: Machine;
  machName: string;
  canInput = false;
  thisJob: JobInfo;
  jobs: JobInfo[] = [{id: 0, jobNumber: "None"}];
  ops = ["None"];
  opSet: string[][] = [["None"]];
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private opServ: OpService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.machName = params['mach'];
    });
    this.mach.fetchMachineByName(this.machName)
    .subscribe(machine => {
      this.machine = machine;
      this.initForm();
    });
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
          if (this.machine.currentJob == info.jobNumber){
            this.thisJob = info;
            console.log(this.thisJob)
          }
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
                    this.changeOps(""+this.thisJob.id);
                  }
                }, ()=>{
                  this.opSet.push(this.ops);
                  this.initForm();
                  this.changeOps(""+this.thisJob.id);
                });
              }
              jobsUsed++;
            }
          }
        });
      }
    });
  }


  private initForm() {

    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.thisJob),
      'currentOp': new FormControl(this.machine.currentOp)
    });
  }

  onSubmit(){
    this.editMachineForm.value.currentJob = this.editMachineForm.value.currentJob.jobNumber;
    this.editMachine(this.editMachineForm.value);
  }

  editMachine(data) {
    this.mach.setCurrentJob(data, this.machName).subscribe(()=>{
      this.mach.machChanged.next();
    });
    setTimeout(
      ()=>{
        this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
  }

  onCancel(){
    window.history.back();;
  }

  changeOps(option: String){
    let val: String = "" +option
    if (this.opSet){
      this.ops = this.opSet[+val.substring(0,1)];
    }
  }

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.machine.machine+ "?")){
      this.mach.deleteMachine(this.machName).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }
}