import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MachineService } from '../machine.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from '../machine.model';
import { JobService } from 'src/app/job/job.service';
import { OpService } from 'src/app/job/job-ops/operation.service';
import { JobInfo } from '../jobInfo.interface';
import { HourlyService } from '../../hourly/hourly.service';

@Component({
  selector: 'app-machine-edit',
  templateUrl: './machine-edit.component.html',
  styleUrls: ['./machine-edit.component.css']
})
export class MachineEditComponent implements OnInit {
  @Input() machine: Machine;
  @Input() id: number;
  editMachineForm: FormGroup;
  canInput: boolean = false;
  jobs = ["None"];
  ops = ["None"];
  page: number = 1;
  machType: string;
  noJobs = false;
  fetching = false;
  
  constructor(
    private machServ: MachineService,
    private auth: AuthService,
    private hourServ: HourlyService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.checkAuth();
    this.checkMachType();
    this.getJobs();
  }

  checkAuth(){
    this.canInput = this.auth.isAuthenticated;
  }


  getJobs(){
    this.jobs = Object.keys(this.machServ.jobOp);
    this.changeOps(this.jobs[0]);
    this.initForm();
  }

  checkMachType(){
    if (this.auth.machType){
      this.machType = this.auth.machType;
    } else {
      this.machType = "lathe";
    }
    this.initForm();
  }
  //Checks if machine type is set, and explicitly specifies it to "lathe" 
  // when called from the hourly component editing access

  addJobOptions(jobs){
    jobs.forEach(job => {
      let goneThrough = 1;
      this.jobs.push(job.jobNumber);
      goneThrough++;
      if (goneThrough == jobs.length){
        this.changeOps(this.machine.currentJob);
        this.cdRef.detectChanges();
      }
    });
  }
  //Adds job number for each job related to the machine type to an array of options 
  // for the currentJob field 
  

  private initForm() {
    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.machine.currentJob),
      'currentOp': new FormControl(this.machine.currentOp),
      'machType': new FormControl(this.machType)
    });
  }
  //Initializes form and sets default values for editing


  changeOps(option: string){
    this.ops = this.machServ.jobOp[option];
  }
  //Sets values for operation based on selected job

  onSubmit(){
    if (this.editMachineForm.value.currentJob != this.machine.currentJob){
      this.updateMachine();
    } else if (this.editMachineForm.value.currentOp != this.machine.currentOp) {
      this.updateMachine();
    } else{
      this.machServ.machChanged.next();
      this.hourServ.hourlyChanged.next();
    }
  }
  //Checks if values have been changed, and calls the update method if they are,
  // and closes the form without updating if they have not changed"

  updateMachine(){
    this.machServ.setCurrentJob(this.editMachineForm.value, this.machine.machine).subscribe(()=>{
      this.machServ.machChanged.next();
      this.hourServ.hourlyChanged.next();
    });
  }
  //Sends edited values for update, and signal to retrieve updated values to
  // relevant components

  onCancel(){
    this.machServ.machCancel.next();
    if (this.id > -1){
      this.hourServ.isJob[this.id] = false;
      this.hourServ.quick[this.id] = false;
    }
  }
  //Turns off editing in related components
}