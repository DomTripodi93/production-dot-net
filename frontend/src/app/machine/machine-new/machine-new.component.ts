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
  jobs = ["None"];
  ops = ["None"];

  constructor(
    private machServ: MachineService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.auth.hideButton(0);
    this.getJobs();
  }

  getJobs(){
    this.jobs = Object.keys(this.machServ.jobOp);
    this.changeOps(this.jobs[0]);
    this.initForm();
  }
  //Gets Jobs for current job and op selection, and initializes form
    
  private initForm() {
    let machine = '';
    this.machineForm = new FormGroup({
      'machine': new FormControl(machine, Validators.required),
      'currentJob': new FormControl(this.jobs[0]),
      'currentOp': new FormControl(this.ops[0]),
      "machType": new FormControl(this.auth.machType)
    });
  }
  //initializes new machine form
  
  onSubmit(){
    this.machServ.addMachine(this.machineForm.value).subscribe(()=>{
      this.machServ.machChanged.next();
      setTimeout(()=>{this.router.navigate([".."], {relativeTo: this.route})},50);
    }, () =>{
      this.error = "This machine already exists!";
      this.isError = true;
    });
  }
  //Submits new machine to API and sends update signal to machine components
  // sets, and displays message if there is an error

  changeOps(option: string){
    this.ops = this.machServ.jobOp[option];
  }
  //Sets values for operation based on selected job

  onCancel(){
    this.machServ.machCancel.next();
  }
  //Returns to previous page when new machine addition is cancelled

  ngOnDestroy(){
    this.auth.showButton(0);
  }
  //Shows 'add new machine' button when component is destroyed

}
