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
  canInput = false;
  jobs = ["None"]
  ops = ["None"];
  
  constructor(
    private mach: MachineService,
    private jobServ: JobService,
    private auth: AuthService,
    private opServ: OpService,
    private hourServ: HourlyService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.mach.fetchMachineByName(this.machName)
    .subscribe(machine => {
      this.machine = machine;
      this.jobServ.fetchAllJobs().subscribe(paginatedResponse =>{
        let goneThrough = 1;
        let response = paginatedResponse.result;
        if (response.length==0){
          this.initForm();
        } else {
          response.forEach(job => {
            this.jobs.push(job.jobNumber);
            goneThrough++;
            if (goneThrough == response.length+1){
              this.changeOps(machine.currentJob);
              this.initForm();
            }
          });
        }
      });
    });
  }


  private initForm() {
    this.editMachineForm = new FormGroup({
      'currentJob': new FormControl(this.machine.currentJob),
      'currentOp': new FormControl(this.machine.currentOp)
    });
  }

  onSubmit(){
    this.editMachine(this.editMachineForm.value);
  }

  editMachine(data) {
    this.mach.setCurrentJob(data, this.machName).subscribe(()=>{
      this.mach.machChanged.next();
      this.hourServ.hourlyChanged.next();
    },()=>{
      this.mach.machChanged.next();
      this.hourServ.hourlyChanged.next();
    });
  }

  onCancel(){
    this.mach.machChanged.next();
    if (this.id > -1){
      this.hourServ.isJob[this.id] = false;
      this.hourServ.quick[this.id] = false;
    }
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

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.machine.machine+ "?")){
      this.mach.deleteMachine(this.machName).subscribe();
      setTimeout(()=>{
        this.mach.machChanged.next();
      }, 50)
    }
  }
}