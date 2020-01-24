import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Machine } from 'src/app/machine/machine.model';
import { OpService } from '../operation.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from 'src/app/machine/machine.service';
import { JobService } from '../../job.service';
import { Operation } from 'src/app/job/job-ops/operation.model';
import { Job } from '../../job.model';

@Component({
  selector: 'app-job-ops-new',
  templateUrl: './job-ops-new.component.html',
  styleUrls: ['./job-ops-new.component.css']
})
export class JobOpsNewComponent implements OnInit {
  @Input() jobNumber: string;
  error = '';
  canInput= false;
  operationForm: FormGroup;
  isError = false;
  machines: Machine[] = [];
  jobInUse: Job;
  
  constructor(
    private opServ: OpService,
    private auth: AuthService,
    private mach: MachineService,
    private jobServ: JobService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.getJob();
  }

  getJob(){
    this.jobServ.fetchJob(this.jobNumber).subscribe((job)=>{
      this.jobInUse = job;
      this.getMachines();
    })
  }

  getMachines(){
    this.mach.fetchMachinesByType()
    .subscribe(machines => {
      this.machines = machines;
      this.initForm();
    });
  }
    
  private initForm() {
    let operation: string;
    let machine: string;
    let remainingQuantity: string;

    if (this.jobInUse.remainingQuantity){
      remainingQuantity = this.jobInUse.remainingQuantity;
    } else if (this.jobInUse.orderQuantity){
      remainingQuantity = this.jobInUse.orderQuantity;
    }

    if (this.machines.length > 0){
      machine = this.machines[0].machine;
    }
    let cycleTime: string;

    this.operationForm = new FormGroup({
      'jobNumber': new FormControl(this.jobNumber, Validators.required),
      'opNumber': new FormControl(operation, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      'remainingQuantity': new FormControl(remainingQuantity),
      'machine': new FormControl(machine, Validators.required)
    });
  }

  onSubmit(){
    this.newOp(this.operationForm.value);
  }

  newOp(data: Operation) {
    this.error= null;
    this.isError = false;
    this.opServ.addOp(data).subscribe(() => {
      this.opServ.opsChanged.next();
    },(error) =>{
      this.isError = true;
      this.error = error;
    });
  }

  onCancel(){
    this.opServ.opsChanged.next();
  }
}
