import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JobService } from '../job.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Job } from '../job.model';
import { PartService } from '../../part/part.service';
import { Part } from 'src/app/part/part.model';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
  error = '';
  canInput= false;
  jobForm: FormGroup;
  isError = false;
  parts: Part[] = []
  andCalculate = "None";
  
  constructor(
    private jobServ: JobService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private partServ: PartService
  ){}
  
  ngOnInit(){
    this.canInput = this.auth.isAuthenticated;
    this.auth.hideButton(0);
    this.partServ.fetchPartsByType()
    .subscribe(parts => {
      this.parts = parts;
      this.initForm();
    });
  }
    
  private initForm() {
    let job: string;
    let part: string = this.parts[0].partNumber;
    let cycleTime: string;
    let orderQuantity: string;
    let weightRecieved: string;
    let oal: string;
    let cutOff: string;
    let mainFacing: string;
    let subFacing: string;

    this.jobForm = new FormGroup({
      'jobNumber': new FormControl(job, Validators.required),
      'partNum': new FormControl(part, Validators.required),
      'cycleTime': new FormControl(cycleTime),
      "orderQuantity": new FormControl(orderQuantity),
      "weightRecieved": new FormControl(weightRecieved),
      "oal": new FormControl(oal),
      "cutOff": new FormControl(cutOff),
      "mainFacing": new FormControl(mainFacing),
      "subFacing": new FormControl(subFacing),
      "machType": new FormControl(this.auth.machType)
    });
  }

  
  onSubmit(){
    console.log(this.jobForm.value)
    this.andCalculate = "None";
    this.newJob(this.jobForm.value);
  }

  newJob(data: Job) {
    this.error= null;
    this.isError = false;
    this.jobServ.jobChanged.next();
    this.jobServ.addJob(data).subscribe(() => {},
      (error) =>{
        this.isError = true;
        this.error = error;
    });
    setTimeout(()=>{
      if (this.isError){
        this.error = "That job already exsists on that machine!";
      } else if (this.andCalculate == "length"){
        this.router.navigate(["calculator/job"], {relativeTo: this.route})
      } else if (this.andCalculate == "weight"){
        this.router.navigate(["calculator/weight"], {relativeTo: this.route})
      } else {
        this.router.navigate([".."], {relativeTo: this.route})
      }
    }, 50);
  }

  onAddThenCalcByLength(){
    this.jobServ.jobHold = this.jobForm.value;
    this.andCalculate = "length";
    this.newJob(this.jobForm.value);
  }

  onAddThenCalcByWeight(){
    this.jobServ.jobHold = this.jobForm.value;
    this.andCalculate = "weight";
    this.newJob(this.jobForm.value);
  }

  onCancel(){
    window.history.back();
  }

  ngOnDestroy(){
    this.auth.showButton(0);
  }

}
