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
  moreJobs: boolean = true;
  machType: string;
  noJobs = false;
  fetching = false;
  
  constructor(
    private machServ: MachineService,
    private jobServ: JobService,
    private auth: AuthService,
    private opServ: OpService,
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
    this.jobServ.fetchJobsByType(this.page, 6, this.machType).subscribe(paginatedResponse =>{
      let response = paginatedResponse.result;
      this.checkMoreJobs(paginatedResponse.pagination.totalPages, paginatedResponse.pagination.currentPage);
      if (response.length == 0){
        this.noJobs = true;
        this.fetching = false;
      } else {
        this.addJobOptions(response);
      }
    });    
  }
  //Gets a set of 6 active jobs based on the current results page

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

  checkMoreJobs(total, current){
    if (total == current){
      this.moreJobs = false;
    }
  }
  //Checks if the current page of paginated results is the last page, if it is the last page
  // it will also set the boolean value that controls the ability to call more jobs to false

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

  addJobs(){
    this.page = this.page + 1;
    this.getJobs();
  }
  //Changes current page to get the next set of 6 active jobs

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
  //Sets options for operation input selector based on the ops for the currently 
  // selected job

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