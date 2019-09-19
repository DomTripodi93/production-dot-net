import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from 'src/app/machine/machine.model';
import { MachineService } from 'src/app/machine/machine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { OpService } from '../operation.service';
import { Operation } from '../operation.model';
import { JobService } from '../../job/job.service';
import { Job } from 'src/app/job/job.model';

@Component({
  selector: 'app-op-new',
  templateUrl: './op-new.component.html',
  styleUrls: ['./op-new.component.css']
})
export class OpNewComponent implements OnInit {
  error = '';
  canInput= false;
  operationForm: FormGroup;
  isError = false;
  machines: Machine[] = [];
  jobs: Job[] = [];
  
  constructor(
    private operationServ: OpService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private mach: MachineService,
    private jobServ: JobService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.initForm();
    });
    this.jobServ.fetchAllJobs()
    .subscribe(jobs => {
      this.jobs = jobs;
      this.initForm();
    });
    this.auth.hideButton(0);
  }
    
  private initForm() {
    let operation: string;
    let job: string;
    let machine: string;
    if (this.machines.length > 0){
      machine = this.machines[0].machine;
    }
    if (this.jobs.length > 0){
      job = this.jobs[0].jobNumber;
    }
    let cycleTime: string;

    this.operationForm = new FormGroup({
      'jobNumber': new FormControl(job, Validators.required),
      'opNumber': new FormControl(operation, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      'machine': new FormControl(machine, Validators.required)
    });
  }

  
  onSubmit(){
    this.newOp(this.operationForm.value);
  }

  newOp(data: Operation) {
    this.error= null;
    this.isError = false;
    this.operationServ.operationChanged.next();
    this.operationServ.addOp(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That op already exsists for that job!";
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }


}
