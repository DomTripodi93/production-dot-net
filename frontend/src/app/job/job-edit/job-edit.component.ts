import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Job } from '../job.model';
import { JobService } from '../job.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { PartService } from 'src/app/part/part.service';
import { Part } from 'src/app/part/part.model';

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
  parts: Part[] = [];
  
  constructor(
    private jobServ: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private partServ: PartService
  ) { }

  ngOnInit() {
    this.canInput = this.auth.isAuthenticated;
    this.route.params.subscribe((params: Params) =>{
      this.jobNum = params['job'];
    });
      this.jobServ.fetchJob(this.jobNum)
      .subscribe(jobs => {
        this.job = jobs[0];
        this.partServ.fetchAllParts()
        .subscribe(parts => {
          this.parts = parts;
          this.initForm();
        });
      });
  }


  private initForm() {
    let job = this.job.jobNumber;
    let part = this.job.part;
    let orderQuantity = this.job.orderQuantity;
    let weightRecieved = this.job.weightRecieved;
    let oal = this.job.oal;
    let cutOff = this.job.cutOff;
    let mainFacing = this.job.mainFacing;
    let subFacing = this.job.subFacing;

    this.editJobForm = new FormGroup({
      'jobNumber': new FormControl(job, Validators.required),
      'partNum': new FormControl(part, Validators.required),
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
    if (confirm("Are you sure you want to delete " +this.job.jobNumber+ "?")){
      this.jobServ.deleteJob(this.jobNum).subscribe();
      setTimeout(()=>{
      this.router.navigate(["../.."], {relativeTo: this.route})
      }, 50)
    }
  }

}