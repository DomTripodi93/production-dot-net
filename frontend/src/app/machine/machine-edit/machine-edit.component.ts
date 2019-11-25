import { Component, OnInit, Input } from '@angular/core';
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
  @Input() machName: string;
  @Input() id: number;
  editMachineForm: FormGroup;
  machine: Machine;
  canInput: boolean = false;
  jobs = ["None"];
  ops = ["None"];
  page: number = 1;
  moreJobs: boolean = true;
  machType: string;
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private auth: AuthService,
    private opServ: OpService,
    private hourServ: HourlyService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.pickMachine();
  }

  pickMachine(){
    this.mach.fetchMachineByName(this.machName)
    .subscribe(machine => {
      this.machine = machine;
      this.getJobs();
    });
  }
  //Gets machine to set current values for form defaults

  getJobs(){
    if (this.auth.machType){
      this.machType = this.auth.machType;
    } else {
      this.machType = "lathe";
    }
    //Checks if machine type is set, and explicitly specifies it for hourly job/op 
    // editing access
    this.jobServ.fetchJobsByType(this.page, 6, this.machType).subscribe(paginatedResponse =>{
      let goneThrough = 0;
      let response = paginatedResponse.result;
      if (paginatedResponse.pagination.totalPages == paginatedResponse.pagination.currentPage){
        this.moreJobs = false;
      }
      if (response.length==0){
        this.initForm();
      } else {
        response.forEach(job => {
          this.jobs.push(job.jobNumber);
          goneThrough++;
          if (goneThrough == response.length){
            this.changeOps(this.machine.currentJob);
            this.initForm();
          }
        });
      }
    });    
  }
  //Gets a set of 6 active jobs based on the current page


  private initForm() {
    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.machine.currentJob),
      'currentOp': new FormControl(this.machine.currentOp),
      "machType": new FormControl(this.auth.machType)
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
    this.mach.setCurrentJob(this.editMachineForm.value, this.machName).subscribe(()=>{
      this.mach.machChanged.next();
      this.hourServ.hourlyChanged.next();
    },()=>{
      this.mach.machChanged.next();
      this.hourServ.hourlyChanged.next();
    });
  }
  //Sends edited values for update, and signal to retrieve updated values to
  // relevant components

  onCancel(){
    this.mach.machChanged.next();
    if (this.id > -1){
      this.hourServ.isJob[this.id] = false;
      this.hourServ.quick[this.id] = false;
    }
  }
  //Turns off editing in related components

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.machine.machine+ "?")){
      this.mach.deleteMachine(this.machName).subscribe();
      setTimeout(()=>{
        this.mach.machChanged.next();
      }, 50)
    }
  }
  //Deletes specified machines upon verification, and updates from machine view
}