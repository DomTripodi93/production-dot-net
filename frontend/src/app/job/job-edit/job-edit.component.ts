import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Job } from '../job.model';
import { Machine } from 'src/app/machine/machine.model';
import { JobService } from '../job.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MachineService } from 'src/app/machine/machine.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {
  editJobForm: FormGroup;
  job: Job;
  jobNum: string;
  canInput = false;
  isError = false;
  error = "";
  machines: Machine[] = [];
  
  constructor(
    private jobServ: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private mach: MachineService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.jobNum = params['job'];
    });
    this.mach.fetchAllMachines()
    .subscribe(machines => {
      this.machines = machines;
      this.jobServ.fetchJob(this.jobNum)
      .subscribe(jobs => {
        this.job = jobs[0];
        this.initForm();
      });
    });
  }


  private initForm() {
    let job = this.job.job;
    let part = this.job.part;
    let orderQuantity = this.job.orderQuantity;
    let weightRecieved = this.job.weightRecieved;
    let oal = this.job.oal;
    let cutOff = this.job.cutOff;
    let mainFacing = this.job.mainFacing;
    let subFacing = this.job.subFacing;

    this.editJobForm = new FormGroup({
      'job': new FormControl(job, Validators.required),
      'part': new FormControl(part, Validators.required),
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing),
    });
  }

  onSubmit(){
    this.job = this.editJobForm.value;
    this.editJob(this.job);
  }

  editJob(data: Job) {
    this.isError = false;
    this.jobServ.changeJob(data, this.jobNum).subscribe(()=>{},
    () =>{
      this.isError = true;
    });
    if (this.isError){
      this.error = "That job already exsists on that machine!";
    }else{
      setTimeout(
        ()=>{
          this.jobServ.jobChanged.next();
          this.router.navigate(["../.."], {relativeTo: this.route})
        }, 50
      );
    }
  }

  onCancel(){
    window.history.back();;
  }

  onDelete(){
    if (confirm("Are you sure you want to delete " +this.job.job+ "?")){
      this.jobServ.deleteJob(this.jobNum).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }

}
